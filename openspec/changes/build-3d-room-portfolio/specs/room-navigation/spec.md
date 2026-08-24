# room-navigation

## ADDED Requirements

### Requirement: Camera mode state machine
The scene SHALL be governed by a single state machine with modes `overview`, `focused`, and `screen`, plus `activeHotspot` and `isTransitioning` flags, held in a store accessible both inside and outside the `<Canvas>`.

#### Scenario: Initial state
- **WHEN** the 3D experience finishes loading
- **THEN** the camera is at the overview pose, mode is `overview`, and all hotspots are interactive

#### Scenario: Focusing a hotspot
- **WHEN** a visitor clicks or taps an enabled hotspot
- **THEN** mode becomes `focused` with that hotspot active, `isTransitioning` is set, and the camera flies smoothly to that hotspot's predefined pose (position + target)

#### Scenario: Arrival clears transition
- **WHEN** the camera transition comes to rest
- **THEN** `isTransitioning` clears, and if the active hotspot is the PC, mode promotes to `screen`

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
Enabled hotspots SHALL show a hover affordance (highlight + pointer cursor + a label naming the section) on pointer devices, and SHALL provide enlarged invisible hit areas so touch targets are at least 44px effective size.

#### Scenario: Hover feedback
- **WHEN** the pointer moves over an enabled hotspot
- **THEN** the object highlights, the cursor becomes a pointer, and a label (e.g., "Projects") is displayed; all revert when the pointer leaves

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
