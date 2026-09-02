## Context

Cloudflare Pages has no not-found setting. It infers the mode from what the build emits: a
top-level `404.html` means "static site, serve this for misses"; no such file means "SPA, route
everything to `/`". The project has always emitted the latter shape, so the SPA behaviour was
never enabled — it was assumed, silently, from an absence.

That is why the existing safeguards all passed. DEPLOY.md said not to enable a toggle, and
nobody did. The verification step said to open `/does-not-exist` and confirm a 404 "not a page
whose assets fail to load" — but at the time, `index.html` was an empty `#root`, so a deep path
rendered a blank page either way and looked unremarkable.

## Goals / Non-Goals

**Goals:**

- Unknown paths return a real not-found response instead of a duplicate of the homepage.
- The not-found page works at any depth, since that is precisely where the current bug bites.
- Replace the unactionable "do not enable X" instruction with the mechanism that actually
  governs the behaviour.

**Non-Goals:**

- A designed error page. It is a dead end that should be cheap, legible, and offer a way back.
- Reusing the app shell. Pulling React in to render a 404 would reintroduce the dependency on
  relative assets that causes the bug.

## Decisions

### A static file, not a route

The 404 page shares no code with the app. That is deliberate: `dist/404.html` has to render
correctly when served for `/a/b/c`, which rules out anything the browser would resolve
relatively — the bundle, the stylesheet, the SVG favicon reference, all of it. A hand-written
document with an inline `<style>` block and root-absolute links has no such dependency and
cannot regress when the bundle's hashes change.

Duplicating a little styling is the cost. It is about thirty lines, it changes roughly never,
and the alternative — a page that depends on the very mechanism that is broken — is worse.

### Root-absolute links, not relative

`href="/"` resolves to the origin root from any depth. `href="./"` would resolve to
`/a/b/` and hand the visitor another 404. Every link on the page is root-absolute for that
reason, and the page references no images, fonts, or scripts at all.

### `noindex`, because the status code is unconfirmed

The Cloudflare docs describe finding and serving the closest `404.html` but do not state the
status code. If it turns out to be `200`, a `404.html` alone would swap one soft 404 for
another — better-looking, equally indexable. `<meta name="robots" content="noindex">` makes the
page unindexable either way, which is correct regardless of the status code and costs one line.

The status code still has to be checked on the deployment; the meta tag is a floor, not a fix.

### Correct DEPLOY.md's instruction, not just its wording

The document's failure was not sloppy phrasing — it named a control that does not exist, so
following it perfectly produced the broken state. The replacement states the rule as a property
of the build output ("`dist/` must contain a top-level `404.html`"), which is a thing a person
can check, and the verification bullet gains `curl -I` so the status code is read rather than
inferred from the page looking right.
