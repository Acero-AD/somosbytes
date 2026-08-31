# room-navigation Specification

## Purpose
TBD - created by archiving change build-3d-room-portfolio. Update Purpose after archive.
## Requirements
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

### Requirement: Return to overview
The system SHALL return the camera to the overview pose and mode to `overview` via any of: Escape key, a visible back button, or clicking/tapping outside any hotspot (including on the floor/walls) while focused.

#### Scenario: Escape key returns
- **WHEN** the visitor presses Escape while mode is `focused` or `screen`
- **THEN** the camera flies back to the overview pose and mode returns to `overview`

#### Scenario: Back button returns
- **WHEN** the visitor clicks the on-screen back button (shown only when mode is not `overview`)
- **THEN** the camera returns to overview

#### Scenario: Click outside returns
- **WHEN** the visitor clicks empty space, the floor, or a wall while focused
- **THEN** the camera returns to overview

### Requirement: Hotspot enablement rules
Hotspots SHALL be interactive only when mode is `overview` and no transition is in progress; while disabled they SHALL not respond to clicks nor change the cursor.

#### Scenario: Hotspots inert while focused
- **WHEN** the visitor is focused on one hotspot and clicks where another hotspot is
- **THEN** nothing happens except the click-outside return behavior

#### Scenario: Clicks ignored mid-flight
- **WHEN** the visitor clicks a second hotspot while the camera is still flying
- **THEN** the click is ignored and the original transition completes

### Requirement: Hover and touch affordances
Enabled portfolio-section hotspots SHALL show a hover affordance (highlight + pointer cursor) on pointer devices; the arcade easter-egg hotspot SHALL NOT highlight or pulse on hover (at most the pointer cursor changes). All hotspots SHALL provide enlarged invisible hit areas so touch targets are at least 44px effective size. Section naming is provided by the persistent hotspot labels rather than a hover-only tooltip.

#### Scenario: Hover feedback
- **WHEN** the pointer moves over an enabled portfolio-section hotspot
- **THEN** the object highlights and the cursor becomes a pointer; both revert when the pointer leaves

#### Scenario: Easter egg stays quiet on hover
- **WHEN** the pointer moves over the arcade cabinet in overview
- **THEN** no highlight or pulse plays on it

#### Scenario: Touch tap focuses directly
- **WHEN** a touch user taps within a hotspot's enlarged hit area
- **THEN** the hotspot focuses on first tap without requiring hover

### Requirement: Constrained overview orbit
In `overview` mode the visitor MAY orbit the camera within clamped polar/azimuth limits; panning and dollying SHALL be disabled, and camera user-input SHALL be disabled entirely while focused.

#### Scenario: Orbit stays inside bounds
- **WHEN** the visitor drags to orbit in overview
- **THEN** the camera rotates within configured limits and never sees the room's open sides or clips through walls

#### Scenario: No dragging while focused
- **WHEN** the visitor attempts to drag while mode is `focused` or `screen`
- **THEN** the framed shot does not move

### Requirement: Persistent hotspot labels
Each portfolio-section hotspot SHALL display a floating label chip naming its section ("Projects", "Writing", "CV", "Contact"), anchored above the object in 3D space. The arcade easter-egg hotspot SHALL NOT display a label chip. Labels SHALL be visible only while mode is `overview` and no transition is in progress, SHALL play a one-shot entrance animation that comes to rest (no perpetual idle animation, so the idle scene still renders zero frames), and clicking or tapping a label SHALL focus its hotspot.

#### Scenario: Labels visible in settled overview
- **WHEN** the camera is at rest in overview
- **THEN** the four portfolio-section labels are visible, each anchored above its object, and the arcade shows none

#### Scenario: Labels hide when leaving overview
- **WHEN** a focus transition starts (label, hotspot click, or tap)
- **THEN** all labels fade out and stay hidden until the camera has returned to rest in overview

#### Scenario: Label click focuses
- **WHEN** the visitor clicks or taps a label chip
- **THEN** the camera flies to that hotspot exactly as if the object itself had been clicked, and the click does not leak into the 3D scene behind the chip

#### Scenario: Idle stays render-free
- **WHEN** the overview has settled and the entrance animation has finished
- **THEN** no further frames render while the visitor is idle

