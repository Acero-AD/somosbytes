# Tasks: Drop Unused glTF Decoders

## 1. Reproduce the violation

- [x] 1.1 Serve `dist/` locally with the `Content-Security-Policy` parsed out of `public/_headers`, so the reproduction cannot drift from the deployed policy
- [x] 1.2 Load the room in a browser and capture the console; confirm the `WebAssembly.instantiate` refusal against `script-src 'self'`
- [x] 1.3 Confirm production sends the same policy (`curl -I https://somosbytes.es/`), so this is a live defect and not a local artifact

## 2. Disable the decoders

- [x] 2.1 In `src/scene/objects/KenneyModel.tsx`, pass `false` for both `useDraco` and `useMeshopt` at the `useGLTF` call
- [x] 2.2 Pass the same pair at the `useGLTF.preload` call — it builds its own extension callback, so the render path alone is not enough
- [x] 2.3 Hold the pair in one constant so the two call sites cannot drift, and comment why the flags are off

## 3. Verify

- [x] 3.1 `tsc -b` and `npm run build` both succeed
- [x] 3.2 Re-serve under the real CSP: the console reports zero violations
- [x] 3.3 Confirm all 21 `.glb` models are requested and return 200 — a canvas renders either way, so its presence alone would not prove the models still load
- [x] 3.4 Confirm no request is made to `gstatic.com`, and the room still renders

## 4. Post-deploy (Diego, after this lands on `main`)

- [ ] 4.1 Open the deployed room with the console open and confirm zero CSP violations, closing out the scenario the `static-hosting` spec has been asserting since the deployment change
