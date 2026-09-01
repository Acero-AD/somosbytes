## MODIFIED Requirements

### Requirement: Fallback content parity and semantics
The fallback SHALL render the same content as the 3D scene — name, tagline, all projects (title, description, link), Substack, CV, socials — from the shared content module, as semantic HTML (heading hierarchy, lists, anchors). It SHALL be present in the DOM even while the 3D experience is active (visually hidden), and `index.html` SHALL carry static title, meta description, OpenGraph tags, and a noscript block with the key links. The OpenGraph set SHALL include `og:url` and `og:image` as absolute URLs on the production origin, and the document SHALL carry a `rel="canonical"` link to that origin, so shared links render a preview and resolve to a single canonical address.

#### Scenario: SEO-readable content
- **WHEN** a crawler or reader mode parses the page while the 3D experience is active
- **THEN** the semantic portfolio content is present in the DOM with a proper heading structure

#### Scenario: JavaScript disabled
- **WHEN** the page loads with JavaScript disabled
- **THEN** the noscript block presents the visitor's name and links to projects, Substack, and CV

#### Scenario: Shared link renders a preview
- **WHEN** the production URL is pasted into a service that reads OpenGraph tags
- **THEN** the preview shows the title, the description, and the branding image, all resolved from absolute URLs without fetching the page's JavaScript

#### Scenario: Canonical address is unambiguous
- **WHEN** the site is reached through a preview deployment URL or any alternate host
- **THEN** the canonical link identifies the production origin as the single indexable address
