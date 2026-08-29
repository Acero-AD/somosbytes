# Proposal: Prepare Pages Deployment

## Why

The site has never been deployed. The original build change explicitly deferred hosting ("handled personally by Diego outside this workspace"), so the repo produces a correct `dist/` but carries nothing that tells a host how to build it, how long to cache what, or how to lock the page down. Diego has picked Cloudflare Pages with Git integration on the apex domain `somosbytes.es`, so the repo now needs the small set of files that make that deploy reproducible on the first try instead of the fourth.

## What Changes

- **Pinned build environment**: an `.nvmrc` so Cloudflare's build image uses a Node that satisfies Vite 8 and TypeScript 6 (both require Node ≥ 22). Without it the build depends on whatever the image defaults to.
- **Cache policy split by asset kind**: a `public/_headers` file. Vite content-hashes everything under `/assets`, so those get a one-year immutable cache. `index.html` and the *unhashed* public files (`/models/*.glb`, `/branding/*`, `/cv/*`) must revalidate instead — caching them immutably would strand visitors on stale models and an outdated CV across deploys.
- **Security headers**: a strict Content-Security-Policy plus `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`, in the same `_headers` file. The bundle contains no `eval`, no inline scripts, no web workers, and makes no third-party requests, so the policy can be tight — `script-src 'self'` with no escape hatches. React's inline `style` attributes are the single unavoidable relaxation.
- **Absolute public URLs in `index.html`**: `og:url`, `og:image` (reusing `public/branding/logo.jpg`), and a canonical link. These are meaningless without a real origin, which is exactly why they were never added; with `https://somosbytes.es` fixed, link previews and canonicalisation start working.
- **A recorded deploy procedure**: the dashboard build settings, custom-domain steps, and the post-deploy verification pass, written down so the next deploy is not archaeology.

Not in scope: replacing the placeholder CV PDF, any change to the 3D scene, and the Cloudflare account/dashboard actions themselves — those happen outside the repo and are documented rather than automated.

## Capabilities

### New Capabilities

- `static-hosting`: how the built site is deployed and served — build reproducibility, cache-control policy per asset class, HTTP security headers, and the custom-domain/preview-deployment behavior.

### Modified Capabilities

- `html-fallback`: one MODIFIED requirement. The existing "content parity and semantics" requirement asks `index.html` to carry OpenGraph tags; it becomes specific about absolute URLs — `og:url`, `og:image`, and a canonical link pointing at the production origin.

## Impact

- New files: `.nvmrc`, `public/_headers`, and a short deploy section in the repo docs.
- Modified: `index.html` (meta tags only — no script or body changes).
- Unchanged: `vite.config.ts` (the relative `base: './'` already works at a domain root), all of `src/`, and every dependency — this change adds no packages.
- External, one-time: connecting the GitHub repo in the Cloudflare dashboard and attaching `somosbytes.es`.
- Risk to watch: the CSP is the only change that can break the live site in a way local `vite preview` will not reveal, since `_headers` is a Pages feature. The tasks cover verifying it against a real preview deployment before the domain is attached.
