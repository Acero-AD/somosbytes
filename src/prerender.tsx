import { renderToStaticMarkup } from 'react-dom/server'
import { FallbackPage } from './fallback/FallbackPage'

// Run by the prerender plugin in vite.config.ts, not by the browser bundle.
//
// `active: false` is the visually-hidden state the fallback already holds while the 3D room
// is up, so the served markup matches the running app and nothing flashes before first paint.
// `main.tsx` calls createRoot().render(), not hydrateRoot(), so React replaces this outright —
// hence renderToStaticMarkup, which emits no hydration markers.
export const renderFallbackMarkup = () => renderToStaticMarkup(<FallbackPage active={false} />)
