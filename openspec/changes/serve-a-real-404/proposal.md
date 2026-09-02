# Proposal: Serve A Real 404

## Why

Every unknown path on the live site returns `200` with `index.html`:

```
/branding/room.jpg            200  text/html
/sitemap.xml                  200  text/html
/definitely-not-a-real-path   200  text/html
```

The `static-hosting` spec says an unknown path "returns a 404 rather than a broken page", and
DEPLOY.md warns at length against the SPA fallback. Both were written; neither is true.

The reason they were not caught is that DEPLOY.md describes a control that does not exist. It
says **"Do not enable the SPA / single-page-app 404 fallback"**, as if there were a dashboard
toggle to leave alone. There is not. Pages infers the mode from the build output:

> "If your project does not include a top-level `404.html` file, Pages assumes that you are
> deploying a single-page application."

`dist/` has no `404.html`, so Pages assumed SPA. Nothing was enabled — the absence of a file
was the setting, and an instruction phrased as "don't turn this on" is satisfied by doing
nothing, which is exactly what happened.

Two consequences, both live now:

- **The page is genuinely broken, not just mislabelled.** `base: './'` makes asset references
  relative, so a deep path resolves them against itself:
  `/some/deep/assets/index-BWdODXTp.js` returns `200 text/html` — `index.html` where a
  JavaScript module is expected. With `X-Content-Type-Options: nosniff` set, the browser
  refuses to execute it. DEPLOY.md predicted this precisely; it is now observable.
- **It is a soft-404 problem for search.** Every typo'd or stale URL is an indexable duplicate
  of the homepage. This got worse with the prerendering change: those duplicates now carry the
  full portfolio content instead of an empty shell. The `rel="canonical"` link is the only
  thing limiting the damage.

## What Changes

- **`public/404.html`**, copied verbatim by Vite to `dist/404.html`, which is what makes Pages
  stop assuming SPA and serve a real not-found page.
- **The page is entirely self-contained** — inline `<style>`, no `<script>`, no external asset
  references. Pages serves the closest `404.html` up the directory tree, so the root page is
  what a visitor at `/some/deep/path` receives, and any relative URL on it would resolve against
  `/some/deep/` and break in the same way `index.html` does today. Links are root-absolute.
- **DEPLOY.md is corrected** to say the mechanism is the file rather than a toggle, and its
  verification step gains the status-code check that would have caught this.
- **The spec scenario is made checkable.** "Unknown path does not break the site" currently
  asserts an outcome with nothing tying it to a cause; it gains the requirement that the output
  carry a top-level `404.html`, so a build that would re-trigger SPA inference is a spec
  violation rather than a surprise in production.

Not in scope: the Cloudflare dashboard, which has nothing to change here.

## Capabilities

### Modified Capabilities

- `static-hosting`: one MODIFIED requirement. "Production origin and preview deployments" gains
  the `404.html` requirement and the constraint that the page carry no relative asset
  references, plus scenarios for the status code and for a deep path.

## Impact

- New file: `public/404.html`.
- Modified: `DEPLOY.md` (the SPA paragraph and one verification bullet). Note that this file
  is listed in `.git/info/exclude`, so it is not under version control and the correction lives
  only in the working copy. That exclude is local and unshared — it is invisible to anyone who
  clones the repo, and it means the deploy procedure has no history and cannot be reviewed.
  Whether to track it is a separate call, since the file describes dashboard steps for a public
  repository; it is flagged here rather than decided.
- Unchanged: `vite.config.ts`, `public/_headers`, and all of `src/`. The prerender plugin only
  rewrites `index.html`, so the 404 page is unaffected by it.
- Unverifiable until deployed: the Cloudflare docs describe locating and serving `404.html` but
  never state the status code it is served with. A page served with `200` would still be a soft
  404 and would not fix the SEO half of this. The post-deploy task checks it with `curl -I`.
