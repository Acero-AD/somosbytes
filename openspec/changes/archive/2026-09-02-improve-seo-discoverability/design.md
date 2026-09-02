## Context

`npm run build` emits a `dist/index.html` of 1,858 bytes whose body is `<div id="root"></div>`,
a `<noscript>` block with three links, and one module script. Everything a visitor reads —
`portfolio.name`, the tagline, the one project with its description and URL, the Substack, CV
and social links — is rendered by React at runtime from `src/content/portfolio.ts`.

`FallbackPage` already renders exactly that content as semantic HTML, and `App` already keeps
it mounted in an `sr-only` state while the 3D room is active, specifically so it is available
to crawlers and screen readers. The component is the right shape; it simply never runs before
the response is sent.

Constraints that shape the decision below:

- `vite.config.ts` sets `base: './'`, and `src/utils/asset.ts` prefixes `import.meta.env.BASE_URL`
  onto public paths. Any prerender must resolve `BASE_URL` the same way the client build does,
  or the prerendered CV link will disagree with the hydrated one.
- The CSP is `script-src 'self'` with no nonce and no hash allowance.
- `FallbackPage` imports no CSS and touches no browser API — no `window`, no `localStorage`, no
  `matchMedia`. It is already a pure function of the content module. `App`, by contrast, reads
  `localStorage` and `location.search` at module scope of its render, so it is not renderable
  on the server; the prerender entry must target the fallback component directly.
- `react-dom/server` is part of the `react-dom` package already in `dependencies`.

## Goals / Non-Goals

**Goals:**

- The portfolio content present in the bytes the server sends, not only in the post-JS DOM.
- Zero new dependencies, and zero change to `FallbackPage`, the content module, or the scene.
- A build that fails loudly if the prerender fails, rather than regressing silently to today's
  empty `#root`.
- Share previews that show the room, and structured data that resolves the author as an entity.

**Non-Goals:**

- Hydration. React will discard the prerendered markup and render fresh; that is intended.
- Prerendering the 3D experience. It is a WebGL canvas — there is no markup to emit.
- A static-site-generator migration, a router, or per-route HTML. The site is one document.

## Decisions

### Prerender via a build-only Vite plugin using a nested SSR server

The plugin runs `apply: 'build'`, `enforce: 'post'` — after Vite has injected its own script
and stylesheet tags — and replaces the empty `#root` in the HTML string with the rendered
markup. To turn `src/prerender.tsx` into something Node can execute, it opens a throwaway Vite
dev server in middleware mode with `configFile: false` and loads the module through
`ssrLoadModule`, then closes it.

The nested server is configured with the same `base: './'` as the real build, so
`import.meta.env.BASE_URL` resolves identically in both passes and `asset('/cv/…')` produces
the same href in the prerendered markup as it does on the client.

**Alternative considered — a second `vite build --ssr` pass plus a Node post-build script:**
the conventional approach, and more obviously correct in isolation, but it emits a second
output directory that then has to be cleaned up, and it splits the logic across `package.json`,
a script file and a config. The nested server keeps the whole mechanism in one plugin with no
build artifacts to sweep.

**Alternative considered — generating the markup from `portfolio.ts` with template strings:**
no React on the server at all, but it forks the fallback markup into a second implementation
that would drift from `FallbackPage` on the first edit. The single-source-of-truth property is
the thing worth protecting here.

### Render in the `sr-only` state, and let the client replace it

`renderToStaticMarkup(<FallbackPage active={false} />)` produces the visually-hidden variant.
This matters for two reasons. Visually, a visitor with JavaScript sees no flash of unstyled
portfolio text before the loader appears — the markup is clipped to a 1px box from the first
paint. Semantically, it is the same state the DOM holds today while the room is active, so the
prerendered file and the running app agree.

`main.tsx` calls `createRoot().render()`, not `hydrateRoot()`, so React replaces the container's
children outright. There is no hydration mismatch to reconcile because there is no hydration.
Using `renderToStaticMarkup` rather than `renderToString` makes that explicit: no `data-reactroot`
and no hydration markers in the output.

A visitor with JavaScript disabled sees the existing `<noscript>` block, unchanged. The
prerendered content is `sr-only` for them too, which is correct — it is there for crawlers and
assistive technology, and `<noscript>` is the visible path.

### Fail the build on a prerender error

If `ssrLoadModule` throws, the plugin must let the error propagate. A caught-and-ignored failure
would emit exactly the file the build emits today, which is the one outcome no one would notice.
The verification task therefore asserts on the built file's content and size rather than on the
exit code.

### The room screenshot becomes the share image

`og:image` currently points at `branding/logo.jpg`, 1200x1200. Scrapers overwhelmingly render
previews at roughly 1.91:1 and crop a square to fit. `docs/screenshot.jpg` is 1600x900 — very
close to that ratio, and it shows the room, which is the reason to click the link. It moves to
`public/branding/room.jpg` because `docs/` is not deployed; the README's reference moves with it.

With a landscape image in place, `twitter:card` becomes `summary_large_image`. It would have
been the wrong choice against the square logo.

### JSON-LD is safe under the existing CSP

`<script type="application/ld+json">` is a data block, not an executable script: the HTML spec's
"prepare the script element" algorithm bails before the CSP inline check for any type that is
not a supported script type. Browsers do not report a violation for it and `script-src 'self'`
needs no relaxation. This is worth recording because the obvious assumption — "inline script,
therefore blocked" — is wrong, and someone will otherwise be tempted to add `unsafe-inline`.

### A sitemap for one URL

Marginal, and honestly close to a no-op for a single-page site that is already linked from
GitHub and Substack. It is included because it costs four lines, and because `robots.txt`
gaining a `Sitemap:` line is the conventional signal that the site has a canonical inventory
rather than an accidental one. `/sitemap.xml` joins the unhashed-public-file list in the
hosting spec's cache requirement, alongside `/robots.txt`.
