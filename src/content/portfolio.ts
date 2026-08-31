import type { Portfolio } from './types'

// Single source of truth: the 3D scene and the HTML fallback both render from it.
export const portfolio: Portfolio = {
  name: 'Diego Acero',
  tagline: 'Software engineer — somosbytes',
  projects: [
    {
      id: 'scribe',
      title: 'The Scribe',
      description: 'A tracking app for writers. Have you written today? Have you posted this week? Straight to the point.',
      url: 'https://scribe.somosbytes.es/',
      icon: '/icons/scribe.svg',
    },
  ],
  substackUrl: 'https://somosbytes.substack.com',
  cvPdfPath: '/cv/diego-acero-cv.pdf',
  socials: [
    { label: 'GitHub', url: 'https://github.com/Acero-AD' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/diego-acero-arguelles' },
  ],
}
