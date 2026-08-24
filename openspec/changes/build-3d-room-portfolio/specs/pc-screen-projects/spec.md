# pc-screen-projects

## ADDED Requirements

### Requirement: Screen zoom on monitor click
Clicking the PC monitor hotspot SHALL fly the camera to a head-on framing of the screen; on arrival the mode SHALL be `screen` and an interactive desktop-style UI SHALL appear on the screen plane.

#### Scenario: Zoom into the screen
- **WHEN** the visitor clicks the PC monitor from overview
- **THEN** the camera flies to a head-on view where the screen fills most of the viewport, and the desktop UI becomes visible and interactive on arrival

#### Scenario: Screen at distance is static
- **WHEN** mode is not `screen`
- **THEN** the monitor shows a non-interactive emissive screen surface (no live DOM mounted on the monitor)

### Requirement: Desktop UI with project icons
The screen UI SHALL present a desktop metaphor (wallpaper, icon grid) with one icon per project from the content source; each icon SHALL be a real HTML anchor opening the project's external URL in a new tab.

#### Scenario: Icon opens project
- **WHEN** the visitor clicks a project icon on the zoomed screen
- **THEN** the project URL opens in a new browser tab and the 3D scene remains in `screen` mode

#### Scenario: Icons show project info
- **WHEN** the visitor hovers a project icon
- **THEN** the project's description is shown (e.g., tooltip), sourced from the content module

### Requirement: Click-gating during transitions
The screen UI SHALL not accept pointer events while a camera transition is in progress.

#### Scenario: No accidental clicks mid-flight
- **WHEN** the visitor clicks where an icon will be while the camera is still flying toward the screen
- **THEN** no link opens; icons become clickable only after the camera comes to rest

### Requirement: Exiting the screen
From `screen` mode the visitor SHALL be able to return to overview via Escape, the back button, or clicking outside the screen area.

#### Scenario: Leave the screen
- **WHEN** the visitor presses Escape while in `screen` mode
- **THEN** the desktop UI unmounts (with a short fade) and the camera returns to overview
