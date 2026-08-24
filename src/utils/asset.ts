// public/ asset URLs in code aren't rewritten by Vite's `base`; prefix them
// so the build also works when served from a bucket subpath.
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
