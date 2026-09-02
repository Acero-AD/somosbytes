# Proposal: Drop Unused glTF Decoders

## Why

`static-hosting` claims the scene renders "with zero CSP violations reported in the browser
console". It does not. Serving `dist/` under the deployed policy and loading the room produces:

```
Uncaught (in promise) CompileError: WebAssembly.instantiate() … violates the following
Content Security policy directive … 'unsafe-eval' is not an allowed source of script
in the following Content Security Policy directive: "script-src 'self'"
```

`curl -I https://somosbytes.es/` confirms production sends that same policy, so this fires on
every real page load of the room today. It was missed during the deployment change because it
is an uncaught promise rejection rather than a visible failure — the room renders regardless,
so task 5.3 looked like it passed.

The cause is drei's `useGLTF`, whose `useDraco` and `useMeshopt` parameters both default to
`true`. `src/scene/objects/KenneyModel.tsx` passes neither, so both decoders get wired up:

- **meshopt** calls `MeshoptDecoder()`, which compiles an inlined WASM blob. That is what the
  CSP refuses.
- **Draco** points `DRACOLoader` at `https://www.gstatic.com/draco/versioned/decoders/1.5.5/`.
  It has never actually fetched, because the decoder is only downloaded when a model carries
  the compression extension — but it is a third-party origin configured into the loader, one
  compressed asset away from a `connect-src 'self'` violation, in a project whose stated
  premise is that it "makes no third-party requests".

The Kenney Furniture Kit ships plain, uncompressed glTF. Neither decoder has ever decoded
anything. The fix is to stop asking for them.

## What Changes

- `KenneyModel.tsx` passes `false` for both `useDraco` and `useMeshopt`, at the `useGLTF` call
  and at the `useGLTF.preload` call — both route through drei's `extensions()`, so both have to
  be told, or the preload pass alone re-triggers the WASM compile.
- The `static-hosting` CSP requirement gains what it was missing: an explicit statement that the
  policy permits neither `unsafe-eval` nor `wasm-unsafe-eval`, and that the scene is expected to
  configure loaders that need neither, so the next person to hit this reaches for the loader
  flags rather than for a wider policy.

Deliberately not in scope: adding `'wasm-unsafe-eval'` to `script-src`. It is the obvious fix
and it is the wrong one here — it widens the policy to license a decoder this project has no
use for. Also out of scope: the SPA-fallback misconfiguration found while verifying this, which
is a dashboard setting rather than a repo change and is written up separately.

## Capabilities

### Modified Capabilities

- `static-hosting`: one MODIFIED requirement. "HTTP security headers on every response" gains
  the `wasm-unsafe-eval` prohibition and a scenario covering the model loaders, so the existing
  "zero CSP violations" claim is actually pinned down by something testable.

## Impact

- Modified: `src/scene/objects/KenneyModel.tsx` (two call sites and a comment).
- Unchanged: `public/_headers` — the whole point is that the policy does not move. No
  dependency changes; drei and three-stdlib stay exactly as they are.
- Bundle size is unaffected. The decoder code is a static import inside drei and still ships;
  what stops is *calling* it. Removing the bytes would mean patching or replacing drei, which
  is not worth it for roughly 1% of a chunk that is already lazily loaded.
- Risk to watch: if a future model is ever exported with Draco or meshopt compression, it will
  now fail to load rather than silently pulling a decoder. That is the intended trade, and the
  spec scenario records it.
