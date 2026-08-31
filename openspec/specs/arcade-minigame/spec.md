# arcade-minigame Specification

## Purpose
A hidden playable Snake easter egg on the room's arcade cabinet, discovered by curiosity rather than signposted.
## Requirements
### Requirement: Hidden arcade hotspot
The arcade machine SHALL be a clickable hotspot without the standard discovery affordances: it SHALL show no floating label chip and no hover highlight or pulse (at most the pointer cursor changes). Focusing it SHALL fly the camera face-on to the cabinet screen and promote mode to `screen` on arrival, and all established return paths (Escape, back button, click-outside) SHALL leave it exactly as they leave the PC.

#### Scenario: Focusing the cabinet
- **WHEN** the visitor clicks or taps the arcade machine from overview
- **THEN** the camera flies to a head-on pose framing the cabinet screen and mode becomes `screen` once the transition rests

#### Scenario: No discovery affordances
- **WHEN** the visitor views the settled overview or hovers the cabinet
- **THEN** no label chip is shown for the arcade and no highlight or pulse plays on it

#### Scenario: Leaving mid-run
- **WHEN** the visitor presses Escape or the back button while a snake run is active
- **THEN** the camera returns to overview, the run ends, and the settled scene resumes its normal render behavior (no frames spent on an abandoned game)

### Requirement: Attract mode
While no run is active, the cabinet screen SHALL show an attract state: retro idle visuals and a blinking `PRESS START` prompt. The blink SHALL follow the ambient-life gating rules (animates only while the page is visible and reduced motion is not requested; otherwise the prompt renders static).

#### Scenario: Attract visible from overview
- **WHEN** the visitor views the room from overview with ambient life enabled
- **THEN** the cabinet screen shows the attract visuals with a blinking `PRESS START`

#### Scenario: Starting a run
- **WHEN** the visitor is focused on the cabinet in `screen` mode and presses a movement/start key or taps the start control
- **THEN** the attract state is replaced by a live snake run

### Requirement: Playable snake
The system SHALL run a grid-based Snake game on the cabinet screen: the snake advances one cell per fixed tick in its current direction; eating food grows the snake by one cell and increments the score; colliding with a wall or its own body ends the run and shows a game-over state with the final score and a restart affordance. The game SHALL render via a runtime-generated canvas texture in the established brand palette, fetching no external assets.

#### Scenario: Eating food
- **WHEN** the snake's head enters the cell occupied by food
- **THEN** the snake grows by one segment, the score increments, and new food appears in a free cell

#### Scenario: Dying
- **WHEN** the snake's head hits the playfield edge or its own body
- **THEN** the run ends and the screen shows a game-over state with the final score and how to restart

#### Scenario: Restarting
- **WHEN** the visitor activates the restart affordance from the game-over state
- **THEN** a fresh run begins with reset length and score

### Requirement: Controls
Desktop visitors SHALL steer with the arrow keys or WASD while in the arcade's `screen` mode; arrow keys SHALL NOT scroll the page, and a 180° reversal into the snake's own neck SHALL be ignored. Touch visitors SHALL get an on-screen d-pad while in the arcade's `screen` mode, with touch targets of at least 44px whose taps do not leak into the 3D scene behind them.

#### Scenario: Keyboard steering
- **WHEN** the visitor presses an arrow or WASD key during a run
- **THEN** the snake turns accordingly on its next tick and the page does not scroll

#### Scenario: Reversal ignored
- **WHEN** the visitor presses the direction opposite to the snake's current heading
- **THEN** the input is ignored and the snake continues in its current direction

#### Scenario: Touch d-pad steering
- **WHEN** a touch visitor taps a d-pad direction during a run
- **THEN** the snake turns accordingly and the tap triggers no scene interaction behind the control

### Requirement: Tick and pause rules
Game frames SHALL render only while a run is active, preserving the demand-frameloop contract everywhere else: a settled attract or game-over screen renders zero frames beyond ambient life's own rules. Hiding the tab SHALL pause an active run, resuming when the tab is visible again. Visitors with `prefers-reduced-motion` MAY still play — an explicitly started run is user-initiated motion — while ambient life remains off.

#### Scenario: Hidden tab pauses the run
- **WHEN** the tab becomes hidden during a run
- **THEN** the game stops ticking and rendering, and the run resumes from the same state when the tab is visible again

#### Scenario: Reduced-motion visitor plays
- **WHEN** a reduced-motion visitor starts a run
- **THEN** the game animates normally for the duration of the run while the rest of the scene stays static

#### Scenario: Settled game over renders nothing
- **WHEN** a run has ended and the game-over screen has settled (and ambient life is off)
- **THEN** no further frames render until the next input

### Requirement: High score persistence
The best score SHALL persist in `localStorage` (guarded so storage failures degrade silently to session-only) and SHALL be shown on the cabinet screen as an `HI`-style readout, updating immediately when beaten.

#### Scenario: High score survives reload
- **WHEN** a visitor beats the high score and later reloads the site
- **THEN** the cabinet screen shows the persisted high score

#### Scenario: Storage unavailable
- **WHEN** `localStorage` is unavailable (e.g., private browsing)
- **THEN** the game still runs and tracks the high score for the current visit only, with no errors surfaced

### Requirement: Easter-egg scope
The minigame SHALL remain an easter egg of the 3D experience: discovered by curiosity rather than signposted, never referenced or embedded in the HTML fallback page, and no portfolio content SHALL depend on it.

#### Scenario: Fallback unchanged
- **WHEN** the visitor uses the classic (fallback) view
- **THEN** the page presents the portfolio content exactly as before, with no minigame reference
