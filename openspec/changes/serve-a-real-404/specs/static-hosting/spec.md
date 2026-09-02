## MODIFIED Requirements

### Requirement: Production origin and preview deployments
The production site SHALL be served from the apex domain `somosbytes.es` over HTTPS, with HTTP requests redirected to HTTPS. Pushes to `main` SHALL deploy to production; pushes to other branches SHALL produce preview deployments on distinct URLs that do not affect the production site. The deployed output SHALL contain a top-level `404.html`, since the host infers single-page-application routing from its absence and would otherwise answer every unmatched path with the entry document. That page SHALL be self-contained — no script, and no reference to any asset by a relative URL — because it is served for paths at any depth, against which relative URLs would not resolve. It SHALL NOT be indexable.

#### Scenario: Apex domain serves the site over HTTPS
- **WHEN** a visitor opens `http://somosbytes.es`
- **THEN** they are redirected to `https://somosbytes.es` and the 3D portfolio loads with a valid certificate

#### Scenario: Branch push does not touch production
- **WHEN** a commit is pushed to a branch other than `main`
- **THEN** a preview deployment is built at its own URL and `somosbytes.es` continues to serve the last `main` build

#### Scenario: Unknown path does not break the site
- **WHEN** a visitor requests a path that does not exist, such as `/does-not-exist`
- **THEN** the host returns a 404 rather than a broken page referencing unresolvable assets

#### Scenario: Unknown path is not a duplicate of the home page
- **WHEN** the response body for an unknown path is inspected
- **THEN** it is the not-found page, not the portfolio content, and it carries a `noindex` directive

#### Scenario: Not-found page renders at any depth
- **WHEN** a visitor requests a nested path that does not exist, such as `/some/deep/path`
- **THEN** the not-found page renders completely, with no request for an asset resolved against `/some/deep/`

#### Scenario: Build output keeps the host out of SPA mode
- **WHEN** the site is built
- **THEN** `dist/404.html` is present, so the host does not infer single-page-application routing
