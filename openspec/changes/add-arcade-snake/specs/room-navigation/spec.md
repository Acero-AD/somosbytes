# room-navigation

## MODIFIED Requirements

### Requirement: Camera mode state machine
The scene SHALL be governed by a single state machine with modes `overview`, `focused`, and `screen`, plus `activeHotspot` and `isTransitioning` flags, held in a store accessible both inside and outside the `<Canvas>`. Hotspots with an interactive surface (the PC and the arcade machine) SHALL promote to `screen` on arrival.

#### Scenario: Initial state
- **WHEN** the 3D experience finishes loading
- **THEN** the camera is at the overview pose, mode is `overview`, and all hotspots are interactive

#### Scenario: Focusing a hotspot
- **WHEN** a visitor clicks or taps an enabled hotspot
- **THEN** mode becomes `focused` with that hotspot active, `isTransitioning` is set, and the camera flies smoothly to that hotspot's predefined pose (position + target)

#### Scenario: Arrival clears transition
- **WHEN** the camera transition comes to rest
- **THEN** `isTransitioning` clears, and if the active hotspot is an interactive-surface hotspot (the PC or the arcade machine), mode promotes to `screen`

### Requirement: Persistent hotspot labels
Each hotspot SHALL display a floating label chip naming its section (e.g., "Projects", "Writing", "CV", "Contact", plus the arcade's label), anchored above the object in 3D space. Labels SHALL be visible only while mode is `overview` and no transition is in progress, SHALL play a one-shot entrance animation that comes to rest (no perpetual idle animation, so the idle scene still renders zero frames), and clicking or tapping a label SHALL focus its hotspot.

#### Scenario: Labels visible in settled overview
- **WHEN** the camera is at rest in overview
- **THEN** all five hotspot labels are visible, each anchored above its object

#### Scenario: Labels hide when leaving overview
- **WHEN** a focus transition starts (label, hotspot click, or tap)
- **THEN** all labels fade out and stay hidden until the camera has returned to rest in overview

#### Scenario: Label click focuses
- **WHEN** the visitor clicks or taps a label chip
- **THEN** the camera flies to that hotspot exactly as if the object itself had been clicked, and the click does not leak into the 3D scene behind the chip

#### Scenario: Idle stays render-free
- **WHEN** the overview has settled and the entrance animation has finished
- **THEN** no further frames render while the visitor is idle
