## Context

The deployed CSP is `script-src 'self'` with no `unsafe-eval`, no nonce and no hash allowance.
`vite preview` does not apply `public/_headers` — that is a Cloudflare Pages feature — so the
policy is invisible during local development, which is how a violation reached production and
stayed there.

Reproducing it locally requires serving `dist/` with the header attached. Parsing the CSP out of
`public/_headers` rather than retyping it keeps the test honest: if the policy changes, the
reproduction changes with it.

## Goals / Non-Goals

**Goals:**

- Zero CSP violations from the room, with the policy unchanged.
- Remove the configured third-party decoder origin, so the "no third-party requests" premise is
  true by construction rather than by the accident of nobody shipping a compressed model.
- Leave behind a spec scenario that fails if either decoder is re-enabled.

**Non-Goals:**

- Shrinking the bundle. The decoder bytes still ship; only the call stops.
- Supporting compressed models. If that is ever wanted, it is a deliberate change with a CSP
  conversation attached, not a default someone inherited.

## Decisions

### Turn the decoders off; do not widen the policy

`'wasm-unsafe-eval'` would silence the error in one line, and it is genuinely narrower than
`'unsafe-eval'` — it permits WebAssembly compilation without permitting `eval` of JavaScript.
It is still the wrong move. The policy would be relaxed to accommodate a decoder that has never
decoded anything, on assets that are uncompressed and are not going to change. The cheaper and
more honest fix is to stop requesting a capability the project does not use.

The Draco half reinforces this. No CSP directive was being violated there yet, so a
`'wasm-unsafe-eval'` fix would have left `DRACOLoader` quietly pointed at `gstatic.com`, and the
first compressed asset would have produced a *second* CSP incident with the same root cause.

### Both call sites, not just the render one

`useGLTF(path, useDraco, useMeshopt)` and `useGLTF.preload(path, useDraco, useMeshopt)` each
build their own extension callback through drei's `extensions()`. `KenneyModel.tsx` calls
preload at module scope for all 21 models and `useGLTF` per instance. Fixing only the render
path would leave the preload pass constructing a `MeshoptDecoder()` on import — the violation
would survive, from a line that looks unrelated.

The two flags are held in one `NO_DECODERS` tuple so the pair cannot drift apart, spread into
both calls.

### Verify by serving the real policy, not by reading the code

The check that matters is a browser loading the built bundle under the actual deployed header
and reporting nothing. Confirming the 21 `.glb` requests all return 200 alongside it is what
distinguishes "no violations" from "no violations because nothing loaded" — a canvas element
exists either way, so its presence proves very little on its own.
