# Tasks: Prepare Pages Deployment

## 1. Pin the build environment

- [x] 1.1 Add `.nvmrc` at the repo root pinning the Node major version (>= 22, satisfying Vite 8 and TypeScript 6)
- [x] 1.2 Verify: `nvm use` in a clean shell selects the pinned version, and `npm ci && npm run build` succeeds on it, emitting `dist/` with hashed filenames under `dist/assets/`

## 2. Headers file

- [x] 2.1 Create `public/_headers` with a `/*` block carrying security headers only — the CSP from design.md, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=(), camera=(), microphone=()` — and deliberately no `Cache-Control`
- [x] 2.2 Add the `/assets/*` block setting `Cache-Control: public, max-age=31536000, immutable`
- [x] 2.3 Verify: `npm run build` copies the file to `dist/_headers` verbatim, and the CSP string contains no `unsafe-eval` and no third-party origin

## 3. Public URL metadata

- [x] 3.1 Add `og:url`, `og:image` (`https://somosbytes.es/branding/logo.jpg`), `og:image:width`/`og:image:height` (1200x1200), and `<link rel="canonical" href="https://somosbytes.es/">` to `index.html`
- [x] 3.2 Verify: `npm run build` and confirm the tags survive into `dist/index.html` with absolute URLs, and that no `src/` code or script tag changed

## 4. Deploy procedure doc

- [ ] 4.1 Write `DEPLOY.md` at the repo root: Pages build settings (build command `npm run build`, output `dist`, root `/`), the "do not enable SPA 404 fallback" note and why, the custom-domain steps for the apex, and the post-deploy verification checklist from group 5
- [ ] 4.2 Verify: a reader who has never seen the Cloudflare dashboard can follow it end to end without consulting design.md

## 5. First deploy and verification (Diego, via the Cloudflare dashboard)

- [ ] 5.1 Land groups 1-4 on `main` first — the files are inert until a host reads them
- [ ] 5.2 Create the Pages project connected to `Acero-AD/somosbytes` with the documented build settings; confirm the build log shows the pinned Node version
- [ ] 5.3 On the `*.pages.dev` URL: load the 3D room with the console open, confirm the scene, `.glb` models, canvas textures, and favicon all render with zero CSP violations
- [ ] 5.4 On the same URL: check response headers on a `/assets/*` file (expect `immutable`) and on `/models/desk.glb` plus `/cv/diego-acero-cv.pdf` (expect revalidation, not `immutable`) — if the platform default is not revalidating, add explicit per-prefix blocks to `_headers` and redeploy
- [ ] 5.5 Confirm an unknown path such as `/does-not-exist` returns a 404 rather than a page with unresolvable assets
- [ ] 5.6 Exercise the fallback path: `?no3d` renders the HTML fallback, and "Skip 3D" persists across a reload

## 6. Attach the domain

- [ ] 6.1 Confirm `somosbytes.es` is on Cloudflare as a zone (nameservers pointed there) before attempting the apex attach
- [ ] 6.2 Attach `somosbytes.es` to the Pages project; wait for the certificate to issue
- [ ] 6.3 Verify: `http://somosbytes.es` redirects to HTTPS and serves the room; the canonical link and OG tags resolve against the live origin; paste the URL into a preview-rendering service and confirm the card shows title, description, and image
- [ ] 6.4 Push a commit to a throwaway branch and confirm it produces a preview URL while `somosbytes.es` keeps serving the last `main` build; delete the branch
