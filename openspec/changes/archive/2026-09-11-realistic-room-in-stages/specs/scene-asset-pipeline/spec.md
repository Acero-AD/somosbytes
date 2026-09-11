## ADDED Requirements

### Requirement: Reproducible asset provenance
Each introduced 3D model, surface texture, and lighting environment SHALL have a recorded source URL, CC0 license evidence or original authorship/dedication, chosen source variant, local output path, preparation recipe and tool version, dimensions where applicable, and output byte size. Model records SHALL also include triangle/material counts and texture dimensions. `CREDITS.md` SHALL reference these records.

#### Scenario: Asset can be traced and rebuilt
- **WHEN** a maintainer inspects an introduced scene asset
- **THEN** its record identifies its origin, license, and the steps/settings needed to reproduce its runtime variant

### Requirement: Self-hosted decoder-free runtime assets
All runtime scene assets SHALL be served from the site's own origin under the existing Content-Security-Policy. New models SHALL use GLB without runtime Draco, Meshopt, or KTX2/Basis decoder requirements. Load and preload paths SHALL disable Draco and Meshopt. Retired model references SHALL be removed from preloading.

#### Scenario: Production policy remains compatible
- **WHEN** the built site is loaded with the actual production security headers
- **THEN** all referenced scene assets load successfully, no external asset/decoder requests occur, and no WebAssembly or CSP errors appear

#### Scenario: Retired assets do not inflate loading
- **WHEN** a full page load is recorded after a furniture replacement
- **THEN** the replaced model is not requested unless another visible object still uses it

### Requirement: Bounded scene assets
The sum of file bytes of unique scene models, surface textures, and environment assets loaded before interaction SHALL be at most 12 MiB, counted before HTTP compression and counting embedded textures only within their model file. Texture dimensions SHALL be at most 2048 pixels per side, with 1024 pixels the default and larger variants justified by visible close-up detail. The environment SHALL be at most 2048 pixels wide. Each stage SHALL record decoded texture-memory estimates alongside file sizes and triangle/material counts; the existing draw-call and rendering budgets SHALL continue to apply.

#### Scenario: Asset inventory fits the budget
- **WHEN** a stage's asset inventory is measured against its actual network requests
- **THEN** unique scene asset bytes stay within 12 MiB, texture dimensions meet the limits, and each texture above 1K has a recorded visual justification

### Requirement: Sequential acceptance checkpoints
Each migration stage SHALL leave a runnable scene and record visual comparisons, interaction results, build/lint results, loading/CSP checks, and rendering metrics before the next stage begins. Failed checks SHALL be resolved or the stage reverted before proceeding. The full change SHALL NOT be reported complete while stage acceptance is pending.

#### Scenario: Stage can be reviewed independently
- **WHEN** a stage is ready for review
- **THEN** its report includes desktop landscape and mobile portrait overview/orbit/focused views in both moods, asset and rendering metrics, and results for affected interactions

#### Scenario: Regression blocks expansion
- **WHEN** a stage fails a visual, interaction, loading, or performance requirement
- **THEN** the failure remains recorded and expansion to the next stage waits for a fix or rollback

### Requirement: Measured mobile acceptance
Final acceptance SHALL record the reference mid-range phone, browser, viewport, and camera-transition frame timings. Across three warmed repetitions of overview-to-focus-and-back for PC, reading area, and arcade in both moods, the p95 visible-frame interval SHALL be at most 33.3 ms. Cold loading SHALL be recorded separately with cache/network conditions and skip/fallback behavior. Desktop CPU throttling SHALL NOT be presented as evidence of mobile GPU performance. Hidden-tab and settled reduced-motion behavior SHALL satisfy the existing zero-frame requirements.

#### Scenario: Mobile result is reproducible
- **WHEN** the final performance report is reviewed
- **THEN** it identifies the physical device and test conditions, records frame timings and draw calls including shadow passes, and demonstrates the required transition and idle behavior

#### Scenario: Device validation is unavailable
- **WHEN** only desktop emulation has been performed
- **THEN** the report labels mobile acceptance pending rather than declaring it passed
