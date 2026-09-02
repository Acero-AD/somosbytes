## MODIFIED Requirements

### Requirement: Cache policy differentiates hashed and unhashed assets
Served responses SHALL carry cache directives matched to whether the filename is content-hashed. Content-hashed build output under `/assets/*` SHALL be cached immutably for one year. `index.html` and every unhashed file copied from `public/` — `/models/*`, `/branding/*`, `/cv/*`, `/icons/*`, `/robots.txt`, `/sitemap.xml` — SHALL be served with a policy that revalidates, so a new deployment reaches returning visitors without a hard refresh.

#### Scenario: Hashed bundle cached long-term
- **WHEN** a visitor requests a file under `/assets/`
- **THEN** the response carries `Cache-Control: public, max-age=31536000, immutable`

#### Scenario: New deployment reaches a returning visitor
- **WHEN** a visitor who has already loaded the site revisits after a deployment that changed a `.glb` model and the CV PDF
- **THEN** they receive the new model and the new PDF without clearing their cache or hard-refreshing

#### Scenario: Entry document is never stale
- **WHEN** `index.html` is requested after a deploy that changed the bundle hashes
- **THEN** the response revalidates and references the newly deployed asset filenames

#### Scenario: Crawl directives are discoverable
- **WHEN** a crawler requests `/robots.txt`
- **THEN** it is served, and it names the absolute URL of `/sitemap.xml`, which is itself served from the production origin
