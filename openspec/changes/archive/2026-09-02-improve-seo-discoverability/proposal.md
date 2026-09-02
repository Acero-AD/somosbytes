# Proposal: Improve SEO Discoverability

## Why

The deployment change gave the site a title, a description, an OpenGraph set and a canonical
link, so the basics are already in place. What it could not fix is that `dist/index.html` is
1,858 bytes of `<div id="root"></div>`: every project title, the tagline and the CV link are
rendered by React on the client. The `html-fallback` spec asks for the portfolio content to be
"present in the DOM" for crawlers, and it is — but only after JavaScript runs. Googlebot
renders JS and will get there on a second pass; social scrapers, Bing's crawler and most AI
crawlers do not, and see a page with no content at all.

The remaining gaps are smaller but sit in the same place: the share image is the 1200x1200
square logo, which every scraper crops to its own aspect ratio, while the one genuinely
distinctive thing about this site — the room — exists as a 1600x900 screenshot that lives in
`docs/` and is never deployed. There is no `twitter:card`, so X renders the small thumbnail
variant. There is no structured data tying "Diego Acero" to this origin and to the GitHub,
LinkedIn and Substack profiles that are already listed on the page. And there is no sitemap.

## What Changes

- **Prerendered fallback content**: a build step renders `FallbackPage` to static markup and
  injects it into `#root`, so the file the server sends already contains the name, tagline,
  every project with its description and link, and the Substack, CV and social links. It is
  rendered in its `sr-only` state — the same state it holds today while the 3D room is active
  — so nothing changes visually and the client render replaces it on hydrationless mount. This
  uses `react-dom/server`, which ships inside the existing `react-dom` dependency, and Vite's
  own SSR module loader; it adds no packages.
- **The room as the share image**: `docs/screenshot.jpg` moves to `public/branding/room.jpg`
  so it is actually deployed, and `og:image` points at it at 1600x900 with alt text. The logo
  stays in `public/branding/` and keeps its own terms under CREDITS.
- **Completed metadata set**: `twitter:card` (`summary_large_image`, now that the image has a
  landscape aspect ratio), `twitter:title`/`description`/`image`, `og:site_name`, `og:locale`,
  `og:image:alt`, and a `theme-color` matching the dusk backdrop that is the default mood.
- **Structured data**: a `Person` JSON-LD block with `name`, `jobTitle`, `url` and `sameAs`
  pointing at the GitHub, LinkedIn and Substack profiles. `application/ld+json` is a data
  block rather than an executed script, so `script-src 'self'` does not block it.
- **A sitemap**: `public/sitemap.xml` with the single canonical URL, referenced from
  `robots.txt`.

Not in scope: server-side rendering of the 3D scene (it is a canvas — there is nothing to
prerender), hydration (the client render deliberately replaces the prerendered markup rather
than adopting it), and any change to the content module, the scene, or the fallback component
itself.

## Capabilities

### Modified Capabilities

- `html-fallback`: one MODIFIED requirement — "Fallback content parity and semantics" gains
  the requirement that the content be in the *served* HTML rather than only in the rendered
  DOM — and one ADDED requirement, "Discovery metadata", covering the Twitter card, the
  descriptive OpenGraph fields, the share image, and the structured-data block.
- `static-hosting`: one MODIFIED requirement. The cache-policy requirement lists the unhashed
  files copied from `public/`; `/sitemap.xml` joins `/robots.txt` in that list.

## Impact

- New files: `src/prerender.tsx`, `public/sitemap.xml`, `public/branding/room.jpg` (moved from
  `docs/screenshot.jpg`).
- Modified: `index.html` (head only), `vite.config.ts` (one build-only plugin),
  `public/robots.txt`, `public/_headers` (comment only), `README.md` (screenshot path).
- Unchanged: every dependency — this change adds no packages — and all of `src/` apart from
  the new prerender entry. `FallbackPage`, the content module and the scene are untouched.
- Risk to watch: the prerender step runs a nested Vite SSR load during `vite build`. If it
  throws, the build must fail loudly rather than silently emitting an empty `#root` — a
  regression that would look exactly like today's output. The tasks cover asserting on the
  built file's size and content, not just on the build exiting zero.
