// Room evidence and production-CSP checks via the installed playwright-cli.
// Start npm run dev and `node scripts/review-room.mjs serve` before reviewing.
import { execFileSync } from 'node:child_process'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { readFileSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, extname, sep } from 'node:path'
import { createHash } from 'node:crypto'

const capture = async (page) => {
  // Capture one viewport/mood per invocation to keep each browser command bounded.
  // Example URL: http://127.0.0.1:5173/?reviewDevice=mobile&reviewMood=day
  const { selectedDevice, selectedMood, stage } = await page.evaluate(() => {
    const options = new URL(location.href).searchParams
    const stage = options.get('reviewStage') || 'baseline'
    if (!/^[a-z0-9-]+$/.test(stage)) throw new Error('Invalid review stage')
    return { selectedDevice: options.get('reviewDevice') || 'desktop', selectedMood: options.get('reviewMood') || 'dusk', stage }
  })
  const report = { views: [], interactions: [], notes: ['Desktop browser; mobile viewport is emulation, not a physical phone.'] }
  const settle = () => page.waitForFunction(() => window.__scene && !window.__scene.getState().isTransitioning)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.evaluate(() => window.__scene.getState().back())
  await settle()
  for (const [device, width, height] of [['desktop', 1280, 720], ['mobile', 390, 844]]) {
    if (device !== selectedDevice) continue
    await page.setViewportSize({ width, height })
    await page.waitForTimeout(2500)
    for (const mood of ['day', 'dusk']) {
      if (mood !== selectedMood) continue
      await page.evaluate(mood => {
        if (window.__scene.getState().mood !== mood) window.__scene.getState().toggleMood()
      }, mood)
      await page.waitForTimeout(2500)
      const capture = async name => {
        await page.screenshot({ path: `docs/room-review/${stage}/${device}-${mood}-${name}.png` })
        report.views.push(await page.evaluate(({ device, mood, name }) => ({ device, mood, name, state: { mode: window.__scene.getState().mode, activeHotspot: window.__scene.getState().activeHotspot }, renderer: window.__glInfo }), { device, mood, name }))
      }
      await capture('overview')
      for (const [label, id] of [['Projects', 'pc'], ['Writing', 'magazines'], ['CV', 'cvFrame'], ['Contact', 'phone'], [null, 'arcade']]) {
        if (label) await page.getByRole('button', { name: label, exact: true }).click()
        else await page.evaluate(() => window.__scene.getState().focus('arcade'))
        await settle()
        const state = await page.evaluate(() => ({ active: window.__scene.getState().activeHotspot, mode: window.__scene.getState().mode }))
        if (state.active !== id) throw new Error(`Failed to focus ${id}`)
        report.interactions.push({ device, mood, id, ...state, activation: label ? 'DOM label click' : 'dev state hook; mesh click not checked' })
        await capture(id)
        await page.keyboard.press('Escape')
        await settle()
      }
      // Drag well beyond each clamped orbit limit, then return to canonical overview.
      for (const [name, dx, dy] of [['orbit-min', -3000, -3000], ['orbit-max', 3000, 3000]]) {
        await page.mouse.move(width * 0.7, height * 0.7)
        await page.mouse.down()
        await page.mouse.move(width * 0.7 + dx, height * 0.7 + dy, { steps: 15 })
        await page.mouse.up()
        await page.waitForTimeout(2500)
        await capture(name)
        await page.evaluate(() => window.__scene.getState().focus('pc'))
        await settle()
        await page.keyboard.press('Escape')
        await settle()
      }
    }
  }
  await page.waitForTimeout(2000)
  const before = await page.evaluate(() => window.__glInfo.frame)
  await page.waitForTimeout(1500)
  report.reducedMotionIdleFrames = (await page.evaluate(() => window.__glInfo.frame)) - before
  report.browser = page.context().browser().version()
  report.resources = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => r.name.includes('/models/')).map(r => ({ url: r.name, bytes: r.decodedBodySize })))
  await page.evaluate(report => { window.__baselineReport = report }, report)
  return report
}

const measure = async (page) => {
  await page.addInitScript(() => {
    const frames = window.__drawFrames = {}
    window.__policyViolations = []
    document.addEventListener('securitypolicyviolation', e => window.__policyViolations.push({ directive: e.violatedDirective, blocked: e.blockedURI }))
    let stamp = 0
    const raf = window.requestAnimationFrame.bind(window)
    window.requestAnimationFrame = cb => raf(t => { stamp = t; cb(t) })
    for (const cls of [WebGLRenderingContext, WebGL2RenderingContext]) {
      for (const name of ['drawElements', 'drawArrays', 'drawElementsInstanced', 'drawArraysInstanced']) {
        const original = cls.prototype[name]
        if (!original) continue
        cls.prototype[name] = function (...args) {
          const frame = frames[stamp] ||= { calls: 0, triangles: 0 }
          frame.calls++
          if (args[0] === this.TRIANGLES) {
            const count = name.startsWith('drawElements') ? args[1] : args[2]
            const instances = name === 'drawElementsInstanced' ? args[4] : name === 'drawArraysInstanced' ? args[3] : 1
            frame.triangles += count / 3 * instances
          }
          return original.apply(this, args)
        }
      }
    }
  })
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const response = await page.reload()
  await page.waitForFunction(() => document.querySelector('canvas') && !document.querySelector('.loader'))
  await page.waitForTimeout(2500)
  const report = await page.evaluate(() => {
    const frames = Object.values(window.__drawFrames)
    return { viewport: [innerWidth, innerHeight], dpr: devicePixelRatio, coldPeak: frames.reduce((a,b)=>b.calls>a.calls?b:a,{calls:0}), settledLastFrames: frames.slice(-10), violations: window.__policyViolations, resources: performance.getEntriesByType('resource').map(r=>({url:r.name,bytes:r.decodedBodySize,status:r.responseStatus})), loadTiming: performance.getEntriesByType('navigation')[0].toJSON() }
  })
  report.csp = response.headers()['content-security-policy']
  report.browser = page.context().browser().version()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(1500)
  const before = await page.evaluate(() => Object.keys(window.__drawFrames).length)
  await page.waitForTimeout(1500)
  report.reducedMotionIdleFrames = (await page.evaluate(() => Object.keys(window.__drawFrames).length)) - before
  await page.evaluate(report => { window.__policyReport = report }, report)
  return report
}

const interactions = async page => {
  await page.addInitScript(() => {
    const frames = window.__drawFrames = {}
    window.__policyViolations = []
    document.addEventListener('securitypolicyviolation', e => window.__policyViolations.push({ directive: e.violatedDirective, blocked: e.blockedURI }))
    let stamp = 0
    const raf = window.requestAnimationFrame.bind(window)
    window.requestAnimationFrame = cb => raf(t => { stamp = t; cb(t) })
    for (const cls of [WebGLRenderingContext, WebGL2RenderingContext]) {
      for (const name of ['drawElements', 'drawArrays', 'drawElementsInstanced', 'drawArraysInstanced']) {
        const original = cls.prototype[name]
        if (!original) continue
        cls.prototype[name] = function (...args) {
          const frame = frames[stamp] ||= { calls: 0, triangles: 0 }
          frame.calls++
          if (args[0] === this.TRIANGLES) {
            const count = name.startsWith('drawElements') ? args[1] : args[2]
            const instances = name === 'drawElementsInstanced' ? args[4] : name === 'drawArraysInstanced' ? args[3] : 1
            frame.triangles += count / 3 * instances
          }
          return original.apply(this, args)
        }
      }
    }
  })
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  await page.setViewportSize({width:390,height:844})
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('http://127.0.0.1:4173')
  const ready = async () => {
    await page.waitForFunction(() => document.querySelector('canvas') && !document.querySelector('.loader'))
    await page.waitForTimeout(2500)
    await page.evaluate(() => { for (const key in window.__drawFrames) delete window.__drawFrames[key] })
  }
  await ready()
  for (const mood of ['day','dusk']) {
    const toggle = page.getByRole('button',{name:`Switch to ${mood}`,exact:true})
    if (await toggle.count()) await toggle.click()
    await page.reload(); await ready()
    if (await page.evaluate(() => localStorage.getItem('mood')) !== mood) throw Error('Mood persistence')
  }
  const interactions = []
  for (const label of ['Projects','Writing','CV','Contact']) {
    await page.getByRole('button',{name:label,exact:true}).click()
    await page.waitForTimeout(1500)
    if (label === 'Projects') {
      const link = page.locator('.screen-icon').first()
      await link.waitFor({state:'visible'})
      const url = await link.getAttribute('href')
      await page.context().route(url, route => route.fulfill({status:200,body:'Review destination'}))
      const popupPromise = page.waitForEvent('popup')
      await link.click()
      const popup = await popupPromise
      await popup.waitForLoadState()
      if (popup.url() !== url) throw Error('PC destination mismatch')
      await popup.close()
      if (!await page.locator('.screen-ui').isVisible()) throw Error('PC lost focus')
    } else {
      if (!await page.locator('.focus-card').getByRole('heading',{name:label,exact:true}).isVisible()) throw Error(`Missing ${label} content`)
    }
    await page.keyboard.press('Escape')
    await page.getByRole('button',{name:'Projects',exact:true}).waitFor()
    await page.waitForTimeout(4000)
    interactions.push(label)
  }
  // Cabinet position from the fixed mobile overview screenshot.
  await page.mouse.click(176,350)
  await page.getByRole('button',{name:'← Back',exact:true}).waitFor({timeout:5000})
  await page.waitForTimeout(1500)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(250)
  await page.keyboard.press('ArrowUp')
  await page.screenshot({path:'docs/room-review/stage-5/production-arcade-playing.png'})
  await page.keyboard.press('Escape')
  await page.getByRole('button',{name:'Projects',exact:true}).waitFor()
  const interactionPeak = await page.evaluate(() => Math.max(...Object.values(window.__drawFrames).map(f=>f.calls)))
  if (interactionPeak >= 180) throw Error(`Interactive draw-call budget exceeded: ${interactionPeak}`)
  await page.goto('http://127.0.0.1:4173/?no3d')
  if (await page.locator('canvas').count()) throw Error('Forced fallback has canvas')
  const fallbackText = (await page.locator('body').innerText()).includes('Diego')
  if (!fallbackText) throw Error('Missing fallback content')
  await page.getByRole('button',{name:'Enter the 3D room →',exact:true}).click()
  await ready()
  if (errors.length) throw Error(JSON.stringify(errors))
  const report = {productionCsp:true,viewport:[390,844],moodPersistence:['day','dusk'],focusAndReturn:interactions,pcLinkPopup:true,arcadeMeshClickAndKeyboard:true,fallback:true,interactionPeak,errors,note:'Gameplay engine progression checked separately on dev; mobile viewport does not measure physical-phone performance.'}
  await page.evaluate(r=>window.__finalReport=r,report)
  return report
}

const loading = async page => {
  let release
  const gate = new Promise(resolve => { release = resolve })
  let delayed = 0
  await page.route('**/textures/room/*', async route => { delayed++; await gate; await route.continue() })
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'domcontentloaded' })
  await page.locator('.loader').waitFor()
  await page.getByRole('button', { name: 'Skip 3D →', exact: true }).first().click()
  await page.waitForFunction(() => !document.querySelector('canvas'))
  const skipped = !await page.locator('canvas').count()
  release()
  await page.unrouteAll({ behavior: 'wait' })
  await page.evaluate(() => localStorage.removeItem('skip3d'))
  await page.reload()
  await page.waitForFunction(() => document.querySelector('canvas') && !document.querySelector('.loader'))
  const maps = await page.evaluate(() => performance.getEntriesByType('resource').filter(r=>r.name.includes('/textures/room/')).map(r=>({url:r.name,bytes:r.decodedBodySize,status:r.responseStatus})))
  if (!skipped || maps.length !== 6 || maps.some(m=>m.status!==200)) throw new Error('Loading/skip check failed')
  const report = { skippedWhileLoading: skipped, delayedRequests: delayed, mapsReadyAfterReload: maps, note: 'RoomSurface loads all maps inside the shared scene Suspense boundary.' }
  await page.evaluate(r=>window.__loadingReport=r,report)
  return report
}

const gameplay = async page => {
  const context = await page.context().browser().newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'})
  const game = await context.newPage()
  try {
    await game.goto('http://127.0.0.1:5173')
    await game.waitForFunction(() => window.__scene && window.__glInfo && !document.querySelector('.loader'))
    await game.waitForTimeout(1500)
    await game.mouse.click(176,350)
    await game.waitForFunction(() => window.__scene.getState().mode==='screen' && window.__scene.getState().activeHotspot==='arcade')
    await game.evaluate(async () => { window.__engine = (await import('/src/scene/objects/snake/engine.ts')).snakeEngine })
    await game.getByRole('button',{name:'Up',exact:true}).tap()
    await game.waitForTimeout(250)
    const start = await game.evaluate(() => ({status:window.__engine.status,ticks:window.__engine.ticks}))
    if (start.status!=='running' || start.ticks<1) throw Error('D-pad did not start ticking')
    await game.getByRole('button',{name:'Up',exact:true}).tap()
    await game.waitForTimeout(150)
    if (await game.evaluate(() => window.__engine.direction) !== 'up') throw Error('D-pad did not steer')
    await game.evaluate(() => {
      Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'hidden'})
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await game.waitForTimeout(2500)
    const before = await game.evaluate(() => ({frame:window.__glInfo.frame,ticks:window.__engine.ticks,status:window.__engine.status}))
    await game.waitForTimeout(1500)
    const after = await game.evaluate(() => ({frame:window.__glInfo.frame,ticks:window.__engine.ticks,status:window.__engine.status}))
    if (after.frame!==before.frame || after.ticks!==before.ticks || after.status!=='paused') throw Error('Hidden pause/idle failed: '+JSON.stringify({before,after}))
    await game.evaluate(() => { delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')) })
    await game.keyboard.press('Enter')
    await game.waitForTimeout(150)
    if (await game.evaluate(() => window.__engine.status) !== 'running') throw Error('Resume failed')
    await game.keyboard.press('Escape')
    await game.waitForFunction(() => window.__scene.getState().mode==='overview' && !window.__scene.getState().isTransitioning)
    if (await game.evaluate(() => window.__engine.status) !== 'attract') throw Error('Exit did not reset')
    const report = {meshClick:true,coarsePointer:true,dpadStartAndSteer:true,start,hiddenBefore:before,hiddenAfter:after,keyboardResume:true,exitReset:true,note:'Desktop touch emulation and synthetic visibility event; physical phone and OS background check pending.'}
    await page.evaluate(r=>window.__gameplayReport=r,report)
    return report
  } finally { await context.close() }
}

async function serve() {
  // Serve the production build with its actual Cloudflare security headers.
  // npm run build && node scripts/review-room.mjs serve

  const root = resolve('dist')
  const policyFile = await readFile(resolve(root, '_headers'), 'utf8')
  const globalBlock = policyFile.split('\n/*\n')[1]?.split('\n\n')[0]
  if (!globalBlock) throw new Error('Missing global header block in dist/_headers')
  const headers = Object.fromEntries(globalBlock.trim().split('\n').map(line => {
    const index = line.indexOf(':')
    return [line.slice(0, index).trim(), line.slice(index + 1).trim()]
  }))
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.glb': 'model/gltf-binary', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' }
  createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`)
      if (!path.startsWith(root + sep)) { res.writeHead(403); res.end(); return }
      const body = await readFile(path)
      res.writeHead(200, { ...headers, 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
      res.end(body)
    } catch {
      res.writeHead(404, headers)
      res.end('Not found')
    }
  }).listen(4173, '127.0.0.1', () => console.log('Production security review: http://127.0.0.1:4173'))
}

async function auditAssets(directory) {
  // Verify the inventory against actual production requests and local GLB headers.
  const inventory = JSON.parse(readFileSync('docs/room-review/assets.json'))
  const report = JSON.parse(readFileSync(`${directory}/production.json`))
  const requests = new Set(report.resources.filter(r=>r.status===200).map(r=>new URL(r.url).pathname))
  const records = []
  for (const entry of inventory.assets) {
    if (!existsSync(entry.path)) {
      if (entry.status !== 'retired') throw Error(`Missing active asset ${entry.path}`)
      continue
    }
    const file = readFileSync(entry.path)
    if (statSync(entry.path).size !== entry.bytes || createHash('sha256').update(file).digest('hex') !== entry.sha256) throw Error(`Stale record ${entry.path}`)
    if (entry.path.endsWith('.glb')) {
      const gltf = JSON.parse(file.subarray(20,20+file.readUInt32LE(12)))
      const forbidden = ['KHR_draco_mesh_compression','EXT_meshopt_compression','KHR_texture_basisu']
      if ([...(gltf.extensionsRequired||[]),...(gltf.extensionsUsed||[])].some(x=>forbidden.includes(x))) throw Error(`Decoder dependency ${entry.path}`)
    } else if (/\.(jpg|png|hdr)$/.test(entry.path) && (!entry.dimensions || Math.max(...entry.dimensions)>2048)) throw Error(`Texture size ${entry.path}`)
    if (requests.has(entry.path.replace(/^public/,''))) records.push(entry)
    else throw Error(`Unused bundled scene asset ${entry.path}`)
  }
  const result = {uniqueRequestedFiles:records.length,sceneBytes:records.reduce((n,a)=>n+a.bytes,0),decodedImageBytesWithMipmaps:records.reduce((n,a)=>n+(a.decodedBytesWithMipmaps||0),0),decoderFree:true,dimensionLimit:2048,notes:'Image-memory estimate excludes HDR, PMREM, shadow targets and generated UI textures. Dimensions use recorded preparation measurements.'}
  if (result.sceneBytes>12*1024*1024) throw Error('12 MiB scene budget exceeded')
  writeFileSync(`${directory}/asset-audit.json`,JSON.stringify(result,null,2)+'\n')
  console.log(result)
}

function cli(session, ...args) {
  const output = execFileSync('playwright-cli', [`-s=${session}`, ...args], {
    encoding: 'utf8', timeout: 115000, maxBuffer: 8 * 1024 * 1024,
  })
  if (output.includes('### Error')) throw Error(output)
  return output
}
function saveReport(session, directory, name, property) {
  const report = JSON.parse(cli(session, '--raw', 'eval', `() => window.${property}`))
  if (!report) throw Error(`Missing ${property}`)
  writeFileSync(`${directory}/${name}.json`, JSON.stringify(report, null, 2) + '\n')
  return report
}
async function review(command, stage) {
  if (!/^(baseline|stage-[1-5])$/.test(stage)) throw Error('Expected baseline or stage-1 through stage-5')
  const directory = `docs/room-review/${stage}`
  mkdirSync(directory, { recursive: true })
  if (command === 'audit') return auditAssets(directory)
  const session = `room-${Date.now()}`
  try {
    if (command !== 'check') {
      cli(session, 'open', 'http://127.0.0.1:5173')
      for (const device of ['desktop', 'mobile']) for (const mood of ['day', 'dusk']) {
        cli(session, 'goto', `http://127.0.0.1:5173/?reviewStage=${stage}&reviewDevice=${device}&reviewMood=${mood}`)
        cli(session, 'run-code', capture.toString())
        const report = saveReport(session, directory, `${device}-${mood}`, '__baselineReport')
        if (!report.views?.length || report.reducedMotionIdleFrames !== 0) throw Error('Capture/idle check failed')
        console.log(`Captured ${stage} ${device} ${mood}`)
      }
      cli(session, 'close')
    }
    cli(session, 'open', 'http://127.0.0.1:4173')
    cli(session, 'run-code', measure.toString())
    const report = saveReport(session, directory, 'production', '__policyReport')
    if (report.violations.length || report.reducedMotionIdleFrames !== 0 || report.settledLastFrames.some(f=>f.calls>=180) || report.resources.some(r=>r.status>=400)) throw Error('Production check failed')
    console.log(`Production: startup ${report.coldPeak.calls}, settled ${report.settledLastFrames.at(-1).calls} calls`)
    cli(session, 'close')
    if (command === 'capture') return
    // Use a fresh session so the two instrumented checks never wrap WebGL twice.
    cli(session, 'open', 'http://127.0.0.1:4173')
    for (const [name, check, property] of [
      ['interactions', interactions, '__finalReport'],
      ['loading', loading, '__loadingReport'],
      ['gameplay', gameplay, '__gameplayReport'],
    ]) {
      cli(session, 'run-code', check.toString().replaceAll('docs/room-review/stage-5/', `${directory}/`))
      saveReport(session, directory, name, property)
      console.log(`Passed ${name}`)
    }
    await auditAssets(directory)
  } finally {
    try { cli(session, 'close') } catch { /* preserve the original review failure */ }
  }
}
const command = process.argv[2] || '--help'
if (command === 'serve') await serve()
else if (['all', 'capture', 'check', 'audit'].includes(command)) await review(command, process.argv[3] || 'stage-5')
else if (command === '--help') console.log('Usage: node scripts/review-room.mjs serve|all|capture|check|audit [stage-5]')
else throw Error(`Unknown review command: ${command}`)
