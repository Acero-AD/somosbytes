## ADDED Requirements

### Requirement: Reproducible static build on the host
The repository SHALL pin the Node major version used to build the site, and the host SHALL build with `npm run build` producing `dist/` as the deployed output. The pinned version MUST satisfy the toolchain's floor (Vite 8 and TypeScript 6 require Node >= 22). The build SHALL install from the committed `package-lock.json` so the deployed bundle matches a local build of the same commit.

#### Scenario: Host picks the pinned Node version
- **WHEN** Cloudflare Pages runs a build for a commit on `main`
- **THEN** it uses the Node version declared in `.nvmrc` and the build log shows that version

#### Scenario: Type errors block the deploy
- **WHEN** a commit is pushed whose TypeScript does not compile
- **THEN** `tsc -b` fails, the Pages build fails, and the previously deployed version stays live

#### Scenario: Deploy output matches a local build
- **WHEN** the same commit is built locally with `npm ci && npm run build`
- **THEN** the emitted asset filenames under `dist/assets/` match those served in production

### Requirement: Cache policy differentiates hashed and unhashed assets
Served responses SHALL carry cache directives matched to whether the filename is content-hashed. Content-hashed build output under `/assets/*` SHALL be cached immutably for one year. `index.html` and every unhashed file copied from `public/` — `/models/*`, `/branding/*`, `/cv/*`, `/icons/*`, `/robots.txt` — SHALL be served with a policy that revalidates, so a new deployment reaches returning visitors without a hard refresh.

#### Scenario: Hashed bundle cached long-term
- **WHEN** a visitor requests a file under `/assets/`
- **THEN** the response carries `Cache-Control: public, max-age=31536000, immutable`

#### Scenario: New deployment reaches a returning visitor
- **WHEN** a visitor who has already loaded the site revisits after a deployment that changed a `.glb` model and the CV PDF
- **THEN** they receive the new model and the new PDF without clearing their cache or hard-refreshing

#### Scenario: Entry document is never stale
- **WHEN** `index.html` is requested after a deploy that changed the bundle hashes
- **THEN** the response revalidates and references the newly deployed asset filenames

### Requirement: HTTP security headers on every response
The site SHALL send a Content-Security-Policy that permits only same-origin scripts, styles, images, and connections, with `data:` allowed for images (the inline SVG favicon) and inline styles allowed (React writes `style` attributes). The policy MUST NOT permit `unsafe-eval` or third-party script origins. Responses SHALL additionally carry `X-Content-Type-Options: nosniff`, a `Referrer-Policy`, a `Permissions-Policy` denying geolocation, camera, and microphone, and `frame-ancestors 'none'`.

#### Scenario: Scene renders under the policy
- **WHEN** the 3D experience loads on a deployed preview with the CSP active
- **THEN** the room, its `.glb` models, the runtime-generated canvas textures, and the favicon all render with zero CSP violations reported in the browser console

#### Scenario: Injected third-party script is refused
- **WHEN** a script element pointing at an external origin is injected into the page
- **THEN** the browser blocks it and reports a CSP violation

#### Scenario: Page cannot be framed
- **WHEN** another site attempts to embed the deployed page in an iframe
- **THEN** the browser refuses to render it

### Requirement: Production origin and preview deployments
The production site SHALL be served from the apex domain `somosbytes.es` over HTTPS, with HTTP requests redirected to HTTPS. Pushes to `main` SHALL deploy to production; pushes to other branches SHALL produce preview deployments on distinct URLs that do not affect the production site.

#### Scenario: Apex domain serves the site over HTTPS
- **WHEN** a visitor opens `http://somosbytes.es`
- **THEN** they are redirected to `https://somosbytes.es` and the 3D portfolio loads with a valid certificate

#### Scenario: Branch push does not touch production
- **WHEN** a commit is pushed to a branch other than `main`
- **THEN** a preview deployment is built at its own URL and `somosbytes.es` continues to serve the last `main` build

#### Scenario: Unknown path does not break the site
- **WHEN** a visitor requests a path that does not exist, such as `/does-not-exist`
- **THEN** the host returns a 404 rather than a broken page referencing unresolvable assets
