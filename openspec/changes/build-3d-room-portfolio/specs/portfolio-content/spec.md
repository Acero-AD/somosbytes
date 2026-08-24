# portfolio-content

## ADDED Requirements

### Requirement: Single typed content source
The system SHALL define all portfolio content (name, tagline, projects, Substack URL, CV PDF path, social links) in one typed module (`src/content/portfolio.ts` conforming to interfaces in `src/content/types.ts`). Both the 3D scene and the HTML fallback SHALL render exclusively from this module.

#### Scenario: Content edit propagates everywhere
- **WHEN** a project entry is added, edited, or removed in `portfolio.ts`
- **THEN** the PC screen UI, the HTML fallback, and any hotspot overlay cards reflect the change without any scene or UI code being modified

#### Scenario: Type safety enforced
- **WHEN** a content entry is missing a required field (e.g., a project without `url`)
- **THEN** the TypeScript build fails rather than rendering a broken link

### Requirement: Project entries carry display and link data
Each project entry SHALL include `id`, `title`, `description`, `url` (external), and `icon` (path under `/icons/`), sufficient for both the desktop-icon rendering and the fallback list rendering.

#### Scenario: Project rendered as desktop icon
- **WHEN** the PC screen UI renders the project grid
- **THEN** each project shows its icon and title, links to its `url`, and exposes its `description` (e.g., as a tooltip)

#### Scenario: Project rendered in fallback
- **WHEN** the HTML fallback renders the project list
- **THEN** each project appears as a semantic list item with title, description, and an anchor to its `url`

### Requirement: CV served as a static asset
The CV SHALL be a PDF file under `public/cv/` referenced by path from the content module, openable directly in the browser.

#### Scenario: CV link opens the PDF
- **WHEN** a visitor activates the CV link (from the 3D frame hotspot card or the fallback)
- **THEN** the browser opens the PDF served from the site's own origin in a new tab
