# Tasks: Improve SEO Discoverability

## 1. Share image

- [x] 1.1 Move `docs/screenshot.jpg` to `public/branding/room.jpg` with `git mv`, so the file is deployed rather than living only in the repo
- [x] 1.2 Update the README's image reference to the new path
- [x] 1.3 Verify: `file public/branding/room.jpg` still reports 1600x900, and the README image resolves

## 2. Metadata in `index.html`

- [x] 2.1 Repoint `og:image` at `https://somosbytes.es/branding/room.jpg` and correct `og:image:width`/`og:image:height` to 1600/900
- [x] 2.2 Add `og:image:alt`, `og:site_name` and `og:locale`
- [x] 2.3 Add the Twitter card set: `twitter:card` as `summary_large_image`, plus `twitter:title`, `twitter:description` and `twitter:image`
- [x] 2.4 Add `<meta name="theme-color">` using the dusk backdrop from `src/scene/palette.ts` (`#2b2136`), since dusk is the default mood
- [x] 2.5 Add the `Person` JSON-LD block: `name`, `jobTitle`, `url`, and `sameAs` for the GitHub, LinkedIn and Substack URLs in `src/content/portfolio.ts`
- [x] 2.6 Verify: the declared image dimensions match `file public/branding/room.jpg`, and the JSON-LD parses as valid JSON

## 3. Sitemap

- [x] 3.1 Add `public/sitemap.xml` with the single canonical URL `https://somosbytes.es/`
- [x] 3.2 Add a `Sitemap:` line to `public/robots.txt` naming its absolute URL
- [x] 3.3 Extend the `public/_headers` comment listing unhashed public files so it mentions `/sitemap.xml`
- [x] 3.4 Verify: `npm run build` copies both files to `dist/` verbatim

## 4. Prerender the fallback

- [x] 4.1 Add `src/prerender.tsx` exporting a function that returns `renderToStaticMarkup(<FallbackPage active={false} />)` — no CSS import, no browser API
- [x] 4.2 Add a build-only, `enforce: 'post'` plugin to `vite.config.ts` that loads that module through a nested `configFile: false` Vite server's `ssrLoadModule` (same `base: './'` as the real build), injects the markup into the empty `#root`, and closes the server
- [x] 4.3 Make the plugin throw if the root element is not found or the render fails, so a regression cannot silently emit an empty root
- [x] 4.4 Verify: `npm run build` succeeds and `dist/index.html` contains the tagline, the project title, its description, and the CV and social links
- [x] 4.5 Verify: the prerendered `<main>` carries the `sr-only` class, and the CV href in the built markup matches what the client renders under `base: './'`
- [x] 4.6 Verify: `npm run lint` and `tsc -b` both pass with the new entry and plugin

## 5. Behavioural check on the built bundle

- [x] 5.1 `npm run preview`: the 3D room loads as before, with no flash of portfolio text before the loader
- [x] 5.2 `npm run preview` with `?no3d`: the fallback renders normally, and the client-rendered content replaces the prerendered copy rather than duplicating it
- [x] 5.3 Confirm the browser console reports no React warning about the container's existing children, and no CSP violation from the JSON-LD block
- [x] 5.4 Confirm exactly one `<main>` is in the DOM after the client render

> Found while running 5.3, unrelated to this change and left alone: drei's meshopt decoder
> inlines a WASM blob and calls `WebAssembly.instantiate` at module scope when the scene chunk
> loads, which `script-src 'self'` refuses. It is harmless today — the Kenney models are not
> meshopt-compressed, so the decoder is never invoked and the room renders — but it logs an
> uncaught CompileError on every production load, and it contradicts the `static-hosting`
> spec's "zero CSP violations" scenario. The fix is `'wasm-unsafe-eval'` in `script-src`, which
> permits WASM compilation without permitting `eval` of JavaScript. That is a change to the
> security posture, so it belongs in its own proposal.

## 6. Post-deploy verification (Diego, after this lands on `main`)

- [x] 6.1 Fetch the deployed `index.html` with `curl` and confirm the portfolio content is in the raw response
- [x] 6.2 Paste the production URL into a preview-rendering service and confirm a large-image card showing the room
- [x] 6.3 Run the deployed URL through a structured-data validator and confirm the `Person` is read without errors
- [x] 6.4 Confirm `https://somosbytes.es/branding/room.jpg` and `https://somosbytes.es/sitemap.xml` both return 200
