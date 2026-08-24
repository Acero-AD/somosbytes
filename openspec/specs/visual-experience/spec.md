# visual-experience Specification

## Purpose
TBD - created by archiving change build-3d-room-portfolio. Update Purpose after archive.
## Requirements
### Requirement: Corner-room diorama layout
The room SHALL be a corner diorama (floor plus two walls) laid out so that the overview camera and its clamped orbit range never reveal the open sides. Props (desk, PC, magazine stack, frame, phone) SHALL be positioned so every hotspot is visible and clickable from the overview pose.

#### Scenario: No missing geometry visible
- **WHEN** the visitor orbits the overview camera to its configured limits
- **THEN** only floor, walls, and props are visible — never the absent walls or the void behind them

### Requirement: Coherent low-poly aesthetic
All materials SHALL derive from a shared palette module; materials of imported CC0 GLTF assets SHALL be overridden to palette colors so mixed-source assets read as one coherent set. Only CC0-licensed assets SHALL be used.

#### Scenario: Mixed assets look uniform
- **WHEN** props from different asset packs are placed in the room
- **THEN** they share the same palette and roughness treatment, with no clashing textures or styles

### Requirement: Lighting without baking
The scene SHALL be lit by an ambient light plus one shadow-casting directional light, grounded with pre-rendered contact shadows. The build SHALL NOT fetch lighting assets (e.g., HDR environments) from external CDNs at runtime.

#### Scenario: Self-contained production build
- **WHEN** the production build runs with the network restricted to the site's own origin
- **THEN** the scene renders fully lit with no failed external requests

### Requirement: Loading splash
While 3D assets load, the app SHALL show a full-viewport splash with a real progress indicator and the "Skip 3D" link; assets SHALL be preloaded so props do not pop in after the splash dismisses.

#### Scenario: Progress shown during load
- **WHEN** the 3D experience is loading
- **THEN** the splash displays loading progress and dismisses only when the scene is ready to interact

### Requirement: Performance budgets
The experience SHALL clamp device pixel ratio to at most 2, keep the scene under ~60 draw calls, and remain smooth (no perceptible stutter during camera transitions) on a mid-range phone. The canvas container SHALL use dynamic-viewport sizing (`100dvh`) so mobile browser chrome does not clip the scene.

#### Scenario: Mobile performance
- **WHEN** the site runs on a mid-range phone (or DevTools 4x CPU throttle emulation)
- **THEN** camera fly-to transitions play smoothly and interaction remains responsive

#### Scenario: High-DPI displays
- **WHEN** the site runs on a 3x-DPI device
- **THEN** rendering resolution is clamped to 2x, keeping GPU load bounded

