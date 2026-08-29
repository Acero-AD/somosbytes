# visual-experience

## MODIFIED Requirements

### Requirement: Ambient life
The scene SHALL include subtle idle motion (at minimum: drifting dust motes, a blinking cursor on the code monitor, and the arcade screen's attract state with its blinking `PRESS START`). Ambient life SHALL render only while the page is visible: a hidden tab SHALL render zero frames, and visitors with `prefers-reduced-motion` SHALL get a fully static scene with zero idle renders — with the single exception that a minigame run the visitor explicitly starts MAY animate while it is active.

#### Scenario: Visible tab animates
- **WHEN** the page is visible and reduced motion is not requested
- **THEN** the ambient motion plays continuously without affecting hotspot interaction

#### Scenario: Hidden tab renders nothing
- **WHEN** the tab is hidden (visibilitychange)
- **THEN** rendering stops completely until the tab is visible again

#### Scenario: Reduced motion respected
- **WHEN** the visitor's system requests reduced motion
- **THEN** no ambient animation plays and the settled scene renders zero frames; only an explicitly started minigame run animates, and only while it is active
