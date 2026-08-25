# visual-experience

## ADDED Requirements

### Requirement: Room decoration
The room SHALL include non-interactive decoration (wall art, a fake window, seating, lamps, and filler props) that follows the shared palette and CC0-only asset rule. Decoration SHALL NOT intercept pointer events intended for hotspots, SHALL NOT occlude any hotspot from the overview pose or its clamped orbit range, and flat or minor decor SHALL skip the shadow pass.

#### Scenario: Decor never steals hotspot clicks
- **WHEN** the visitor clicks or taps any of the four hotspots from overview
- **THEN** the hotspot focuses exactly as before decoration was added

#### Scenario: Hotspots stay visible
- **WHEN** the visitor orbits the overview camera to its configured limits
- **THEN** every hotspot (and its label) remains visible, unobstructed by decoration

## MODIFIED Requirements

### Requirement: Performance budgets
The experience SHALL clamp device pixel ratio to at most 2, keep the scene under 120 draw calls including the shadow pass, and remain smooth (no perceptible stutter during camera transitions) on a mid-range phone. The idle, settled scene SHALL render zero frames (`frameloop="demand"`). The canvas container SHALL use dynamic-viewport sizing (`100dvh`) so mobile browser chrome does not clip the scene.

#### Scenario: Mobile performance
- **WHEN** the site runs on a mid-range phone (or DevTools 4x CPU throttle emulation)
- **THEN** camera fly-to transitions play smoothly and interaction remains responsive

#### Scenario: High-DPI displays
- **WHEN** the site runs on a 3x-DPI device
- **THEN** rendering resolution is clamped to 2x, keeping GPU load bounded

#### Scenario: Idle renders nothing
- **WHEN** the scene has settled and receives no input
- **THEN** no frames render until the next interaction or camera transition
