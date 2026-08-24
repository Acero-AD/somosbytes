# html-fallback Specification

## Purpose
TBD - created by archiving change build-3d-room-portfolio. Update Purpose after archive.
## Requirements
### Requirement: Fallback rendering conditions
The app SHALL render the plain HTML fallback page instead of the 3D experience when any of: WebGL is unavailable, the URL contains `?no3d`, or the visitor previously chose "Skip 3D" (persisted in localStorage). The fallback SHALL offer an "Enter 3D room" link that clears the persisted choice.

#### Scenario: WebGL unavailable
- **WHEN** the browser cannot create a WebGL context
- **THEN** the fallback page renders with all portfolio content and no broken canvas

#### Scenario: Explicit opt-out persists
- **WHEN** the visitor clicks "Skip 3D" and later revisits the site
- **THEN** the fallback renders directly without loading 3D assets, until they click "Enter 3D room"

#### Scenario: Query-string override
- **WHEN** the site is opened with `?no3d` in the URL
- **THEN** the fallback renders regardless of WebGL support

### Requirement: Skip link always reachable
A visible "Skip 3D" link SHALL be available from the loading splash onward, so visitors can reach the content without waiting for or entering the 3D experience.

#### Scenario: Skip during loading
- **WHEN** 3D assets are still loading and the visitor clicks "Skip 3D" on the splash
- **THEN** the fallback page is shown immediately

### Requirement: Fallback content parity and semantics
The fallback SHALL render the same content as the 3D scene — name, tagline, all projects (title, description, link), Substack, CV, socials — from the shared content module, as semantic HTML (heading hierarchy, lists, anchors). It SHALL be present in the DOM even while the 3D experience is active (visually hidden), and `index.html` SHALL carry static title, meta description, OpenGraph tags, and a noscript block with the key links.

#### Scenario: SEO-readable content
- **WHEN** a crawler or reader mode parses the page while the 3D experience is active
- **THEN** the semantic portfolio content is present in the DOM with a proper heading structure

#### Scenario: JavaScript disabled
- **WHEN** the page loads with JavaScript disabled
- **THEN** the noscript block presents the visitor's name and links to projects, Substack, and CV

### Requirement: WebGL context loss handling
If the WebGL context is lost at runtime, the app SHALL show a message offering to reload or switch to the classic (fallback) view.

#### Scenario: Context lost mid-session
- **WHEN** the browser drops the WebGL context (e.g., mobile Safari memory pressure)
- **THEN** the visitor sees a recovery message with working "reload" and "use classic view" actions instead of a frozen canvas

