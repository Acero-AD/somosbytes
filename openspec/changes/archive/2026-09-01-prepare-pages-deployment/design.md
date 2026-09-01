## Context

The repo builds a fully static SPA — React 19 + react-three-fiber, no backend, no API calls, no environment variables. A production build is 1.8 MB across 30 files, the largest single file being the 0.99 MB lazily-loaded `Scene3DApp` chunk. There is no client-side router: the app is one document that swaps between the 3D experience and the HTML fallback in-place.

That shape makes hosting almost a non-decision — any static host works, which is why the original change deferred it. What has been decided since: **Cloudflare Pages, Git integration, apex domain `somosbytes.es`**. The zone is presumed already on Cloudflare, since `scribe.somosbytes.es` resolves there.

Constraints worth stating up front, because they shape every decision below:

- `vite.config.ts` sets `base: './'` — all built asset references are document-relative.
- Assets split into two classes: **content-hashed** files Vite emits into `dist/assets/`, and **unhashed** files copied verbatim from `public/` (the 21 `.glb` models, `branding/logo.jpg`, the CV PDF, `icons/scribe.svg`, `robots.txt`).
- Nothing in `src/` reads a secret. The only `import.meta.env` uses are `DEV` and `BASE_URL` (`src/utils/asset.ts:3`), so there is no build-time configuration to inject and no risk of leaking one.

## Goals / Non-Goals

**Goals:**

- A first deploy that succeeds without trial-and-error on the build image's Node version.
- Cache directives that make deploys land immediately for returning visitors while still getting long-term caching where it is free to take.
- A Content-Security-Policy tight enough to be worth having, verified against a real deployment rather than assumed.
- Shareable links: OpenGraph and canonical metadata resolving against the production origin.
- A written procedure, so the second deploy is not a rediscovery of the first.

**Non-Goals:**

- Automating the Cloudflare account side. Connecting the repo and attaching the domain are dashboard actions; this change documents them, it does not script them.
- Any CI pipeline, wrangler dependency, or API token in the repo. Git integration was chosen precisely to avoid holding a credential.
- Analytics, error reporting, or any third-party script — each would force a hole in the CSP for no benefit yet identified.
- Replacing the placeholder CV PDF, and any change to the scene itself.

## Decisions

### Pages with Git integration, not Workers Static Assets

Cloudflare has been steering new projects toward Workers with a static-assets binding, and that is the right call when a site needs edge logic in front of it. This one does not: no API routes, no auth, no redirects beyond apex HTTPS. Workers Static Assets would add `wrangler` as a dependency, a `wrangler.jsonc`, and a deploy credential, to arrive at the same bytes over the same network. Pages Git integration gives push-to-deploy with zero repo surface.

The escape hatch is real if it is ever needed: a Pages project can gain a `functions/` directory later, and the `_headers` file written here carries over to Workers Static Assets almost unchanged.

**Alternative considered — GitHub Actions + wrangler:** more control and a reproducible build log, at the cost of storing a Cloudflare API token as a repo secret. Not justified for a personal portfolio that deploys on push.

### Keep `base: './'`; do not enable SPA 404 fallback

Relative base resolves correctly at a domain root (`./assets/…` from `/` is `/assets/…`) and keeps the build portable to a bucket subpath, which was an explicit requirement of the original change. There is no reason to switch it to `/`.

But it constrains one host setting: **404s must return 404, not rewrite to `index.html`.** With a SPA fallback, a request for `/some/deep/path` would serve `index.html`, whose relative `./assets/…` references would then resolve against `/some/deep/`, producing a page that 404s every asset. Since the app has no router, nothing wants that fallback anyway. This is a "leave the default alone" decision, but it needs to be written down because enabling SPA mode is the reflexive thing to do for a React app.

### `_headers` lives in `public/`, and sets Cache-Control only where it deviates

Vite copies `public/` verbatim into `dist/`, so `public/_headers` becomes `dist/_headers`, which is where Pages reads it. No build config needed.

Cache policy splits along the hashed/unhashed line:

| Path | Policy | Why |
|---|---|---|
| `/assets/*` | `public, max-age=31536000, immutable` | Content-hashed by Vite; the filename changes when the content does, so caching forever is free |
| `index.html`, `/models/*`, `/branding/*`, `/cv/*`, `/icons/*` | must revalidate | Filenames are stable across deploys — an immutable cache here would strand visitors on old models and a stale CV indefinitely |

The subtle part: when several `_headers` rules match one request, Pages applies them cumulatively, and two rules both setting `Cache-Control` is ambiguous at best. So the `/*` block carries **security headers only, no `Cache-Control`**, and the single `/assets/*` block carries the immutable directive. Everything else inherits the platform default, which is expected to already be revalidating — that expectation is verified against a preview deployment rather than trusted, and if it turns out to be wrong, explicit per-prefix blocks get added.

### CSP: strict is actually achievable here

The bundle was checked before writing the policy, not after:

- Zero occurrences of `eval(` or `new Function(` across both emitted chunks — no `unsafe-eval` needed. This is the usual reason a three.js site ends up with a useless CSP, and it does not apply.
- The built `index.html` contains exactly one `<script>`, an external module reference — no inline script, so no nonce or hash machinery.
- No web workers, no `blob:` URLs, no Draco or KTX2 loaders. Textures are generated on same-origin `<canvas>` elements (`src/utils/canvasTextures.ts`), which CSP does not govern.
- No runtime fetch to any third party. The external URLs in `src/content/portfolio.ts` are anchor targets, and `connect-src` does not apply to navigation.

That yields:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; connect-src 'self'; object-src 'none';
base-uri 'none'; form-action 'none'; frame-ancestors 'none'
```

Two relaxations, both deliberate. `'unsafe-inline'` for styles is unavoidable: React writes `style` attributes (three places in `src/`, plus drei internals), and CSP blocks inline style attributes without it. With `script-src 'self'` holding, the risk is cosmetic injection rather than code execution. `data:` in `img-src` is for the emoji SVG favicon declared inline in `index.html`.

`frame-ancestors 'none'` is used in place of `X-Frame-Options`; it supersedes the older header in every browser that matters.

**Alternative considered — start permissive and tighten later:** rejected. The permissive version never gets tightened, and the verification cost is the same either way since the site must be smoke-tested on a preview deployment regardless.

### OG image reuses the existing branding asset

`og:image` points at `https://somosbytes.es/branding/logo.jpg` — already in the repo, 1200×1200. Square rather than the 1.91:1 that most preview cards prefer, so it will render as a square or centre-cropped card. That is a fair trade against adding a second 260 KB image for the sole purpose of link previews; a purpose-built 1200×630 card can replace it later without touching anything else.

These tags are hardcoded to the production origin rather than derived from `import.meta.env.BASE_URL`, because OpenGraph consumers require absolute URLs and there is exactly one production origin. A preview deployment will therefore advertise the production origin in its canonical link — which is the correct behavior: previews should not be indexed as alternates.

### Node pinned via `.nvmrc`

Vite 8 and TypeScript 6 both require Node ≥ 22. `.nvmrc` is honored by the Pages build image and by `nvm` locally, so one file covers both. Pinning the major version only (not a patch) keeps the build getting security updates without pinning churn.

## Risks / Trade-offs

- **CSP breaks something only visible in production** → `_headers` is a Pages feature that `vite preview` does not apply, so the policy cannot be validated locally. Mitigation: the domain is attached only after a preview deployment has been loaded with the console open and confirmed free of CSP violations. Rollback is a one-line edit and a push.
- **Platform cache defaults are assumed, not verified** → the unhashed-asset policy leans on Pages' default being revalidating. Mitigation: the response headers on a `.glb` and on the CV PDF are inspected on the preview deployment; explicit blocks are added if the default is anything else.
- **Apex domain on Cloudflare Pages requires the zone to be on Cloudflare** → apex records need CNAME flattening, which is a Cloudflare zone feature. If `somosbytes.es` is registered elsewhere with DNS elsewhere, nameservers have to move first. Mitigation: verified before the domain step, and the site is fully usable on `*.pages.dev` in the meantime.
- **Preview deployments are publicly reachable** → every branch push produces a live URL. For a portfolio this is harmless; noted so it is a known property rather than a surprise. Cloudflare Access can gate previews later if it ever matters.
- **The CV PDF becomes publicly indexable** → `robots.txt` is `Allow: /`, so once the real CV replaces the placeholder it is crawlable and its contents are public. This change does not alter that; it is flagged as a decision to make when the real PDF lands.
- **`og:image` is square** → link previews will crop. Accepted, replaceable later.

## Migration Plan

There is nothing live to migrate — this is a first deploy. The sequencing exists to keep the risky step last:

1. Land the repo files (`.nvmrc`, `public/_headers`, `index.html` meta) on `main`. All three are inert until a host reads them, so this is safe to merge before any Cloudflare setup exists.
2. Create the Pages project against the repo; the first build produces a `*.pages.dev` URL.
3. Verify on that URL: scene renders, no CSP violations, cache headers correct on both asset classes.
4. Only then attach `somosbytes.es`.

Rollback at any point: Cloudflare Pages keeps every deployment, and a previous one can be promoted from the dashboard. Removing the custom domain reverts to `*.pages.dev` without touching the repo. Reverting the commit and pushing restores the pre-change state.

## Open Questions

- Should `www.somosbytes.es` redirect to the apex? Conventional and cheap (a Cloudflare redirect rule), but not required for the site to work. Deferred unless Diego wants it.
- Whether to disallow `/cv/` in `robots.txt` once the real CV replaces the placeholder — a content decision, not a hosting one, and out of scope here.
