import react from '@vitejs/plugin-react'
import { createServer, defineConfig, type Plugin } from 'vite'

const ROOT_DIV = '<div id="root"></div>'

// Puts the HTML fallback into the file the server sends, instead of leaving `#root` empty
// until React runs. Crawlers that don't execute JavaScript otherwise see a blank page.
//
// The markup comes from FallbackPage itself, via a throwaway SSR server, so the content module
// stays the single source of truth — adding a project reaches the static HTML for free.
function prerenderFallback(): Plugin {
  let base = '/'

  return {
    name: 'prerender-fallback',
    apply: 'build',
    // After Vite has injected its own script and stylesheet tags.
    enforce: 'post',

    configResolved(config) {
      base = config.base
    },

    async transformIndexHtml(html) {
      if (!html.includes(ROOT_DIV)) {
        throw new Error(`prerender-fallback: no ${ROOT_DIV} to render into`)
      }

      const server = await createServer({
        configFile: false,
        logLevel: 'error',
        appType: 'custom',
        server: { middlewareMode: true },
        plugins: [react()],
        // A dev server normalizes a relative base to '/', but src/utils/asset.ts builds public/
        // URLs out of BASE_URL — so without this the prerendered CV link would be '/cv/…' while
        // the client renders './cv/…'. Identical at a domain root, wrong under a subpath, which
        // is the case the relative base exists for. Pin it to the base the client build used.
        define: { 'import.meta.env.BASE_URL': JSON.stringify(base) },
      })

      try {
        // Anything thrown here must escape: swallowing it would emit the empty-root file this
        // plugin exists to prevent, and the build would look like it worked.
        const { renderFallbackMarkup } = await server.ssrLoadModule('/src/prerender.tsx')
        return html.replace(ROOT_DIV, `<div id="root">${renderFallbackMarkup()}</div>`)
      } finally {
        await server.close()
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // relative base so the static build works when served from a bucket subpath
  base: './',
  plugins: [react(), prerenderFallback()],
})
