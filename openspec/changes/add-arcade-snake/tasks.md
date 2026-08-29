# Tasks: add-arcade-snake

## 1. Hotspot wiring & readability spike

- [x] 1.1 Add the `arcade` hotspot: entry in `hotspots.ts` (pose along the screen's +x normal, label "Arcade", labelOffset above the marquee), `INTERACTIVE_HOTSPOTS` set in `store.ts` generalizing the pc-only screen promotion, invisible hit box + `Hotspot` wrapper in `Experience.tsx`
- [x] 1.2 Spike: stamp a throwaway grid CanvasTexture on the screen plane, fly to the pose, screenshot, and settle grid size (22×17 vs smaller) and final pose; verify overview label layout at desktop + portrait widths

## 2. Game engine

- [x] 2.1 Implement `src/scene/objects/snake/engine.ts`: pure grid/snake/food logic, fixed tick advance, buffered direction queue with reversal rejection, status machine (`attract | running | paused | over`), score + guarded `snakeHighScore` persistence
- [x] 2.2 Verify engine behavior in isolation (eat-and-grow, wall/self death, restart reset, reversal ignored, storage-unavailable fallback) via a quick node/vitest harness or dev-console exercise

## 3. Screen rendering

- [ ] 3.1 Replace the shimmer/bg planes in `ArcadeMachine.tsx` with one CanvasTexture plane (`NearestFilter`, `toneMapped` false) and a canvas painter covering attract (drifting pixels + blinking `PRESS START` + `HI ####`), live run, paused, and game-over states in brand palette
- [ ] 3.2 Add the `ArcadeScreen` tick loop: `useFrame` accumulator invalidating only while running, repaint + `texture.needsUpdate` on state changes, attract blink riding ambient-ticker frames (static prompt under reduced motion), `visibilitychange` pause/resume, engine reset to attract on leaving the hotspot

## 4. Input

- [ ] 4.1 Keyboard: window `keydown` mounted only in arcade `screen` mode — arrows/WASD steer, `preventDefault` on handled keys, any input starts/restarts from attract/over; Escape still exits via the existing back path
- [ ] 4.2 Touch d-pad in `Overlay.tsx` + `index.css`: shown in arcade `screen` mode on `(pointer: coarse)` devices, ≥44px targets, `stopPropagation` on pointer events, wired to `engine.setDirection()`/start

## 5. Verification & docs

- [ ] 5.1 Interaction pass (playwright): focus arcade from overview (click + label), play a run with keyboard, die, restart, Escape/back/click-outside mid-run returns cleanly, d-pad steers on touch emulation without leaking taps
- [ ] 5.2 Render-contract pass: settled attract/game-over renders zero frames beyond ambient rules, hidden tab pauses a run, reduced-motion room stays static while a started run animates, high score survives reload
- [ ] 5.3 Perf + regression pass: draw calls via `__glInfo` (expect net reduction, budget <180), production build green, fallback page unchanged; update CREDITS/README only if needed
