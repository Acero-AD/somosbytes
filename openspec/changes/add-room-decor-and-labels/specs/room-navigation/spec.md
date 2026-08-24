# room-navigation

## ADDED Requirements

### Requirement: Persistent hotspot labels
Each hotspot SHALL display a floating label chip naming its section (e.g., "Projects", "Writing", "CV", "Contact"), anchored above the object in 3D space. Labels SHALL be visible only while mode is `overview` and no transition is in progress, SHALL play a one-shot entrance animation that comes to rest (no perpetual idle animation, so the idle scene still renders zero frames), and clicking or tapping a label SHALL focus its hotspot.

#### Scenario: Labels visible in settled overview
- **WHEN** the camera is at rest in overview
- **THEN** all four hotspot labels are visible, each anchored above its object

#### Scenario: Labels hide when leaving overview
- **WHEN** a focus transition starts (label, hotspot click, or tap)
- **THEN** all labels fade out and stay hidden until the camera has returned to rest in overview

#### Scenario: Label click focuses
- **WHEN** the visitor clicks or taps a label chip
- **THEN** the camera flies to that hotspot exactly as if the object itself had been clicked, and the click does not leak into the 3D scene behind the chip

#### Scenario: Idle stays render-free
- **WHEN** the overview has settled and the entrance animation has finished
- **THEN** no further frames render while the visitor is idle

## MODIFIED Requirements

### Requirement: Hover and touch affordances
Enabled hotspots SHALL show a hover affordance (highlight + pointer cursor) on pointer devices, and SHALL provide enlarged invisible hit areas so touch targets are at least 44px effective size. Section naming is provided by the persistent hotspot labels rather than a hover-only tooltip.

#### Scenario: Hover feedback
- **WHEN** the pointer moves over an enabled hotspot
- **THEN** the object highlights and the cursor becomes a pointer; both revert when the pointer leaves

#### Scenario: Touch tap focuses directly
- **WHEN** a touch user taps within a hotspot's enlarged hit area
- **THEN** the hotspot focuses on first tap without requiring hover
