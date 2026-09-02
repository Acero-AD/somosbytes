# Tasks: Serve A Real 404

## 1. The not-found page

- [x] 1.1 Add `public/404.html`: a complete document with an inline `<style>`, no `<script>`, and no external or relative asset references
- [x] 1.2 Match the fallback page's palette and type from `src/index.css` so it reads as part of the site without importing anything
- [x] 1.3 Make every link root-absolute (`/`, not `./`), since the page is served for paths at any depth
- [x] 1.4 Add `<meta name="robots" content="noindex">`, correct whatever status code the host serves it with
- [x] 1.5 Verify: `npm run build` copies it to `dist/404.html` verbatim, and the prerender plugin leaves it alone
- [x] 1.6 Add `/404.html` to the unhashed-public-file list in the `public/_headers` comment, so the cache note stays accurate

## 2. Prove it is self-contained

- [x] 2.1 Verify: the built `dist/404.html` contains no `<script>`, no `src=`, and no `href` beginning `./` or `assets/`
- [x] 2.2 Verify: served from a deep path with no other file reachable, the page still renders fully styled

## 3. Correct DEPLOY.md

- [x] 3.1 Replace "Do not enable the SPA / single-page-app 404 fallback" with the actual mechanism — the host infers SPA routing when the output has no top-level `404.html`, so the rule is that `dist/404.html` must exist
- [x] 3.2 Keep the `base: './'` explanation, which is the reason the fallback is harmful here, and note that it is why the 404 page carries no relative references
- [x] 3.3 Change the verification bullet from "open `/does-not-exist`" to `curl -I`, so the status code is read rather than inferred from the page looking right
- [x] 3.4 Decide whether `DEPLOY.md` should be tracked at all — it is currently in `.git/info/exclude`, so these corrections are working-copy only and no one else can see them

## 4. Post-deploy (Diego, after this lands on `main`)

- [x] 4.1 `curl -I https://somosbytes.es/does-not-exist` and confirm a real `404` status — a `404.html` served with `200` is still a soft 404 and does not fix the search half of this
- [x] 4.2 Confirm `/some/deep/path` renders the styled 404 page rather than a broken portfolio
- [x] 4.3 Re-check that `/sitemap.xml` and `/branding/room.jpg` now return their real content, and that a genuinely missing file returns 404
- [x] 4.4 Confirm the site root, `?no3d`, and the CV PDF are all unaffected
