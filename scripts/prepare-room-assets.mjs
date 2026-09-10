// Rebuild local CC0 assets with Node and macOS sips. No runtime decoders.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

async function prepareSurfaces(fabricOnly = false) {
  // Download selected CC0 source maps, verify their manifest checksums, and resize
  // to the documented runtime variant. Run with Node and macOS sips available.

  const output = fabricOnly ? 'public/textures/furniture' : 'public/textures/room'
  const sourceDir = '/private/tmp/somosbytes-room-source'
  await mkdir(output, { recursive: true })
  await mkdir(sourceDir, { recursive: true })
  const assets = []
  for (const id of fabricOnly ? ['fabric_pattern_07'] : ['wood_floor', 'plastered_wall']) {
    const response = await fetch(`https://api.polyhaven.com/files/${id}`)
    if (!response.ok) throw new Error(`${id}: ${response.status}`)
    const manifest = await response.json()
    const selectedMaps = fabricOnly ? [['nor_gl', 'normal'], ['Rough', 'roughness']] : [['Diffuse', 'color'], ['nor_gl', 'normal'], ['Rough', 'roughness']]
    for (const [map, suffix] of selectedMaps) {
      const source = manifest[map]['1k'].jpg
      const response = await fetch(source.url)
      if (!response.ok) throw new Error(`${source.url}: ${response.status}`)
      const bytes = Buffer.from(await response.arrayBuffer())
      if (createHash('md5').update(bytes).digest('hex') !== source.md5) throw new Error(`Checksum mismatch: ${source.url}`)
      const original = `${sourceDir}/${id}-${suffix}.jpg`
      const path = `${output}/${id}-${suffix}.jpg`
      await writeFile(original, bytes)
      execFileSync('sips', ['-Z', '1024', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', original, '--out', path])
      const result = await readFile(path)
      assets.push({ path, status: 'prepared', source: `https://polyhaven.com/a/${id}`, license: 'CC0-1.0', licenseEvidence: 'https://polyhaven.com/license', sourceVariant: '1k jpg', sourceUrl: source.url, sourceMd5: source.md5, sha256: createHash('sha256').update(result).digest('hex'), bytes: result.length, dimensions: [1024, 1024], decodedBytesWithMipmaps: Math.ceil(1024 * 1024 * 4 * 4 / 3), recipe: 'scripts/prepare-room-assets.mjs surfaces: sips -Z 1024 -s format jpeg -s formatOptions 80', tool: execFileSync('sips', ['--version'], { encoding: 'utf8' }).trim(), date: '2026-09-09' })
    }
  }
  const inventoryPath = 'docs/room-review/assets.json'
  const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'))
  inventory.assets = [...inventory.assets.filter(a => !assets.some(next => next.path === a.path)), ...assets]
  await writeFile(inventoryPath, JSON.stringify(inventory, null, 2) + '\n')
  console.log(JSON.stringify({ maps: assets.length, totalBytes: assets.reduce((s,a)=>s+a.bytes,0) }))
}

async function prepareImports() {
  // Prepare the selected Poly Haven CC0 assets as self-contained, decoder-free files.

  const root = '/private/tmp/somosbytes-room-source'
  await mkdir(root, { recursive: true })
  const records = []
  const hash = (data, type = 'sha256') => createHash(type).update(data).digest('hex')
  async function download(file) {
    const response = await fetch(file.url)
    if (!response.ok) throw new Error(`${response.status}: ${file.url}`)
    const bytes = Buffer.from(await response.arrayBuffer())
    if (file.md5 && hash(bytes, 'md5') !== file.md5) throw new Error(`Checksum mismatch: ${file.url}`)
    return bytes
  }
  async function manifest(id) {
    const response = await fetch(`https://api.polyhaven.com/files/${id}`)
    if (!response.ok) throw new Error(`Manifest ${id}: ${response.status}`)
    return response.json()
  }
  for (const id of ['modern_arm_chair_01', 'potted_plant_02']) {
    const files = await manifest(id)
    const source = files.gltf['1k'].gltf
    const gltf = JSON.parse((await download(source)).toString())
    const parts = [], imageRecords = []
    let length = 0
    const append = data => {
      const offset = length
      const padded = Buffer.alloc(Math.ceil(data.length / 4) * 4)
      data.copy(padded)
      parts.push(padded)
      length += padded.length
      return offset
    }
    const offsets = []
    for (const buffer of gltf.buffers) {
      const file = source.include[buffer.uri]
      if (!file) throw new Error(`Unlisted buffer: ${buffer.uri}`)
      offsets.push(append(await download(file)))
    }
    for (const view of gltf.bufferViews) {
      view.byteOffset = (view.byteOffset || 0) + offsets[view.buffer]
      view.buffer = 0
    }
    for (const [index, image] of (gltf.images || []).entries()) {
      const file = source.include[image.uri]
      if (!file) throw new Error(`Unlisted image: ${image.uri}`)
      const original = await download(file)
      const input = `${root}/${id}-${index}-${image.uri.split('/').pop()}`
      await writeFile(input, original)
      // Keep PNG alpha for foliage; JPEG maps use a smaller quality-80 variant.
      const png = image.uri.toLowerCase().endsWith('.png')
      const output = `${root}/${id}-${index}-runtime.${png ? 'png' : 'jpg'}`
      execFileSync('sips', ['-Z', '1024', '-s', 'format', png ? 'png' : 'jpeg', ...(!png ? ['-s', 'formatOptions', '80'] : []), input, '--out', output])
      const data = await readFile(output)
      const dimensions = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', output], { encoding: 'utf8' })
      const width = Number(dimensions.match(/pixelWidth: (\d+)/)[1])
      const height = Number(dimensions.match(/pixelHeight: (\d+)/)[1])
      imageRecords.push({ sourceUrl: file.url, sourceMd5: file.md5, bytes: data.length, width, height, decodedBytesWithMipmaps: Math.ceil(width * height * 4 * 4 / 3) })
      image.bufferView = gltf.bufferViews.length
      gltf.bufferViews.push({ buffer: 0, byteOffset: append(data), byteLength: data.length })
      image.mimeType = png ? 'image/png' : 'image/jpeg'
      delete image.uri
    }
    if ((gltf.extensionsUsed || []).some(x => /draco|meshopt|basisu/i.test(x))) throw new Error('Decoder-dependent source')
    gltf.buffers = [{ byteLength: length }]
    const json = Buffer.from(JSON.stringify(gltf))
    const jsonPadded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20)
    json.copy(jsonPadded)
    const header = Buffer.alloc(20)
    header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4)
    header.writeUInt32LE(28 + jsonPadded.length + length, 8)
    header.writeUInt32LE(jsonPadded.length, 12); header.writeUInt32LE(0x4e4f534a, 16)
    const binHeader = Buffer.alloc(8)
    binHeader.writeUInt32LE(length, 0); binHeader.writeUInt32LE(0x004e4942, 4)
    const data = Buffer.concat([header, jsonPadded, binHeader, ...parts])
    const path = `public/models/realistic/${id}.glb`
    await mkdir('public/models/realistic', { recursive: true })
    await writeFile(path, data)
    let triangles = 0
    for (const mesh of gltf.meshes || []) for (const p of mesh.primitives) triangles += gltf.accessors[p.indices ?? p.attributes.POSITION].count / 3
    records.push({ path, status: 'prepared', source: `https://polyhaven.com/a/${id}`, sourceUrl: source.url, sourceMd5: source.md5, sourceVariant: '1k glTF', license: 'CC0-1.0', licenseEvidence: 'https://polyhaven.com/license', bytes: data.length, sha256: hash(data), triangles, materials: gltf.materials?.length || 0, images: imageRecords, extensionsUsed: gltf.extensionsUsed || [], bounds: null, recipe: 'scripts/prepare-room-assets.mjs imports: embed source buffers/images, sips max1024 JPEG quality80; retain PNG alpha; no geometry compression', tool: `${process.version}; ${execFileSync('sips', ['--version'], { encoding: 'utf8' }).trim()}`, date: '2026-09-09' })
  }
  const environmentId = 'studio_small_09'
  const environmentSource = (await manifest(environmentId)).hdri['1k'].hdr
  const environment = await download(environmentSource)
  await mkdir('public/environments', { recursive: true })
  const path = `public/environments/${environmentId}_1k.hdr`
  await writeFile(path, environment)
  records.push({ path, status: 'prepared', source: `https://polyhaven.com/a/${environmentId}`, sourceUrl: environmentSource.url, sourceMd5: environmentSource.md5, sourceVariant: '1k HDR', license: 'CC0-1.0', licenseEvidence: 'https://polyhaven.com/license', bytes: environment.length, sha256: hash(environment), recipe: 'scripts/prepare-room-assets.mjs imports: unchanged source HDR, no recompression', tool: process.version, date: '2026-09-09' })
  const inventoryPath = 'docs/room-review/assets.json'
  const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'))
  inventory.assets = [...inventory.assets.filter(a => !records.some(next => next.path === a.path)), ...records]
  await writeFile(inventoryPath, JSON.stringify(inventory, null, 2) + '\n')
  console.log(JSON.stringify(records.map(({ path, bytes, triangles }) => ({ path, bytes, triangles }))))
  await externalizeImages()
}

async function externalizeImages() {
  // GLTFLoader fetches embedded images through blob: URLs, blocked by this site's
  // CSP. Keep geometry in GLB and reference colocated, same-origin image files.
  const digest = data => createHash('sha256').update(data).digest('hex')
  const inventoryPath = 'docs/room-review/assets.json'
  const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'))
  await mkdir('public/models/realistic/textures', { recursive: true })
  for (const id of ['modern_arm_chair_01', 'potted_plant_02']) {
    const path = `public/models/realistic/${id}.glb`
    const source = await readFile(path)
    const jsonLength = source.readUInt32LE(12)
    const gltf = JSON.parse(source.subarray(20, 20 + jsonLength))
    if (!(gltf.images || []).some(image => image.bufferView !== undefined)) continue
    const bin = source.subarray(28 + jsonLength)
    const entry = inventory.assets.find(a => a.path === path)
    const views = gltf.images.map(image => image.bufferView)
    const imageStart = Math.min(...views.map(index => gltf.bufferViews[index].byteOffset || 0))
    for (const [index, image] of gltf.images.entries()) {
      const view = gltf.bufferViews[image.bufferView]
      const data = bin.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength)
      const uri = `textures/${id}-${index}.${image.mimeType === 'image/png' ? 'png' : 'jpg'}`
      const outputPath = `public/models/realistic/${uri}`
      await writeFile(outputPath, data)
      const meta = entry.images[index]
      const record = { ...meta, path: outputPath, status: 'prepared', source: entry.source, license: entry.license, licenseEvidence: entry.licenseEvidence, sha256: digest(data), dimensions: [meta.width, meta.height], recipe: 'scripts/prepare-room-assets.mjs imports: extract images without changing bytes', tool: entry.tool, date: '2026-09-10' }
      inventory.assets = [...inventory.assets.filter(a => a.path !== outputPath), record]
      image.uri = uri
      delete image.bufferView
      meta.path = outputPath
    }
    // The preparation script appends images after all geometry buffer views.
    gltf.bufferViews = gltf.bufferViews.slice(0, Math.min(...views))
    gltf.buffers[0].byteLength = imageStart
    const json = Buffer.from(JSON.stringify(gltf))
    const padded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20); json.copy(padded)
    const header = Buffer.alloc(20)
    header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4)
    header.writeUInt32LE(28 + padded.length + imageStart, 8)
    header.writeUInt32LE(padded.length, 12); header.writeUInt32LE(0x4e4f534a, 16)
    const binHeader = Buffer.alloc(8)
    binHeader.writeUInt32LE(imageStart, 0); binHeader.writeUInt32LE(0x004e4942, 4)
    const data = Buffer.concat([header, padded, binHeader, bin.subarray(0, imageStart)])
    await writeFile(path, data)
    entry.bytes = data.length
    entry.sha256 = digest(data)
    entry.recipe += '; image extraction moves images into colocated URLs for CSP compatibility'
  }
  await writeFile(inventoryPath, JSON.stringify(inventory, null, 2) + '\n')
}

const command = process.argv[2] || '--help'
switch (command) {
  case 'surfaces': await prepareSurfaces(); break
  case 'fabric': await prepareSurfaces(true); break
  case 'imports': await prepareImports(); break
  case 'all': await prepareSurfaces(); await prepareSurfaces(true); await prepareImports(); break
  case '--help': console.log('Usage: node scripts/prepare-room-assets.mjs surfaces|fabric|imports|all'); break
  default: throw Error(`Unknown preparation command: ${command}`)
}
