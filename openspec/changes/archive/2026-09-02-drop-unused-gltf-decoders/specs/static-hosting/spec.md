## MODIFIED Requirements

### Requirement: HTTP security headers on every response
The site SHALL send a Content-Security-Policy that permits only same-origin scripts, styles, images, and connections, with `data:` allowed for images (the inline SVG favicon) and inline styles allowed (React writes `style` attributes). The policy MUST NOT permit `unsafe-eval`, MUST NOT permit `wasm-unsafe-eval`, and MUST NOT permit third-party script origins. The scene SHALL therefore load its assets with loaders that require neither WebAssembly compilation nor a decoder fetched from another origin: the bundled models are uncompressed glTF, so the Draco and meshopt decoders SHALL be disabled at every `useGLTF` entry point rather than the policy being widened to admit them. Responses SHALL additionally carry `X-Content-Type-Options: nosniff`, a `Referrer-Policy`, a `Permissions-Policy` denying geolocation, camera, and microphone, and `frame-ancestors 'none'`.

#### Scenario: Scene renders under the policy
- **WHEN** the 3D experience loads on a deployed preview with the CSP active
- **THEN** the room, its `.glb` models, the runtime-generated canvas textures, and the favicon all render with zero CSP violations reported in the browser console

#### Scenario: Models load without a decoder
- **WHEN** the built bundle is served with the deployed Content-Security-Policy attached and the room is opened
- **THEN** every bundled `.glb` is requested and returns 200, the scene renders, and the console reports no `WebAssembly.instantiate` refusal

#### Scenario: No decoder is fetched from another origin
- **WHEN** the network activity of a full page load is inspected
- **THEN** no request is made to a Draco or meshopt decoder on a third-party origin, and no such origin is configured into the loader

#### Scenario: Injected third-party script is refused
- **WHEN** a script element pointing at an external origin is injected into the page
- **THEN** the browser blocks it and reports a CSP violation

#### Scenario: Page cannot be framed
- **WHEN** another site attempts to embed the deployed page in an iframe
- **THEN** the browser refuses to render it
