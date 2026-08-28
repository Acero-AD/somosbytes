import type { Portfolio } from './types'

// TODO(diego): replace every placeholder below with real content.
// This file is the single source of truth: the 3D scene and the HTML
// fallback both render from it.
export const portfolio: Portfolio = {
  name: 'Diego Acero',
  tagline: 'Software engineer — somosbytes',
  projects: [
    {
      id: 'scribe',
      title: 'The Scribe',
      description: 'A side project living at scribe.somosbytes.es.', // TODO: one-liner about what it does
      url: 'https://scribe.somosbytes.es/',
      icon: '/icons/scribe.svg',
    },
    {
      id: 'project-two',
      title: 'Project Two', // TODO: real project
      description: 'Placeholder project description. Replace me.',
      url: 'https://github.com/Acero-AD',
      icon: '/icons/project-two.svg',
    },
    {
      id: 'project-three',
      title: 'Project Three', // TODO: real project
      description: 'Placeholder project description. Replace me.',
      url: 'https://github.com/Acero-AD',
      icon: '/icons/project-three.svg',
    },
  ],
  substackUrl: 'https://somosbytes.substack.com',
  cvPdfPath: '/cv/diego-acero-cv.pdf', // placeholder file — drop the real PDF over it
  socials: [
    { label: 'GitHub', url: 'https://github.com/Acero-AD' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/diego-acero-arguelles' },
  ],
}
