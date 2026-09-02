## MODIFIED Requirements

### Requirement: Fallback content parity and semantics
The fallback SHALL render the same content as the 3D scene — name, tagline, all projects (title, description, link), Substack, CV, socials — from the shared content module, as semantic HTML (heading hierarchy, lists, anchors). It SHALL be present in the DOM even while the 3D experience is active (visually hidden), and it SHALL additionally be present in the HTML document as served, prerendered at build time from the same component and the same content module, so that the content is available without executing JavaScript. The prerendered markup SHALL be emitted in its visually-hidden state, and the client SHALL replace rather than hydrate it. A prerender failure SHALL fail the build rather than emitting a document with an empty root. `index.html` SHALL carry static title, meta description, OpenGraph tags, and a noscript block with the key links. The OpenGraph set SHALL include `og:url` and `og:image` as absolute URLs on the production origin, and the document SHALL carry a `rel="canonical"` link to that origin, so shared links render a preview and resolve to a single canonical address.

#### Scenario: SEO-readable content
- **WHEN** a crawler or reader mode parses the page while the 3D experience is active
- **THEN** the semantic portfolio content is present in the DOM with a proper heading structure

#### Scenario: Content present without JavaScript execution
- **WHEN** the deployed `index.html` is fetched and read as raw text, without running any script
- **THEN** the name, tagline, every project title with its description and link, and the Substack, CV and social links are all present in the markup

#### Scenario: Adding a project reaches the served HTML
- **WHEN** a project is added to the content module and the site is rebuilt
- **THEN** its title, description and link appear in the built `index.html` without the fallback component or the build configuration being touched

#### Scenario: Prerender failure is not silent
- **WHEN** the build-time render of the fallback throws
- **THEN** the build fails, and no `dist/index.html` with an empty root element is emitted

#### Scenario: No flash of prerendered content
- **WHEN** a visitor with JavaScript and WebGL loads the page
- **THEN** the prerendered markup is visually hidden from the first paint, the loader appears as before, and no portfolio text flashes on screen

#### Scenario: JavaScript disabled
- **WHEN** the page loads with JavaScript disabled
- **THEN** the noscript block presents the visitor's name and links to projects, Substack, and CV

#### Scenario: Shared link renders a preview
- **WHEN** the production URL is pasted into a service that reads OpenGraph tags
- **THEN** the preview shows the title, the description, and the branding image, all resolved from absolute URLs without fetching the page's JavaScript

#### Scenario: Canonical address is unambiguous
- **WHEN** the site is reached through a preview deployment URL or any alternate host
- **THEN** the canonical link identifies the production origin as the single indexable address

## ADDED Requirements

### Requirement: Discovery metadata
`index.html` SHALL carry, in addition to the OpenGraph set, a Twitter card declaration whose type matches the aspect ratio of the share image, together with the card's title, description and image. The OpenGraph set SHALL include `og:site_name`, `og:locale`, and `og:image:alt`. The share image SHALL be a deployed asset on the production origin with a landscape aspect ratio suited to link previews, and its declared `og:image:width` and `og:image:height` MUST match the actual pixel dimensions of that file. The document SHALL carry a `theme-color` matching the default mood of the room, and a `Person` structured-data block in JSON-LD naming the author, their role, the canonical URL, and `sameAs` links to the external profiles listed in the content module. The structured-data block MUST NOT require any relaxation of the site's Content-Security-Policy.

#### Scenario: Large card on a link preview
- **WHEN** the production URL is shared on a service that reads Twitter card tags
- **THEN** the preview renders as a large-image card showing the room, with the title and description

#### Scenario: Declared image dimensions are truthful
- **WHEN** the file referenced by `og:image` is inspected
- **THEN** its pixel dimensions equal the declared `og:image:width` and `og:image:height`

#### Scenario: Structured data survives the CSP
- **WHEN** the deployed page loads with the Content-Security-Policy active
- **THEN** the JSON-LD block is present in the document, a structured-data parser reads a valid `Person` from it, and the browser console reports no CSP violation

#### Scenario: Share image is actually deployed
- **WHEN** the absolute URL named by `og:image` is requested from the production origin
- **THEN** it returns the image rather than a 404
