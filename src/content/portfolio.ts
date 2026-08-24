import type { Portfolio } from './types'

// TODO(diego): replace every placeholder below with real content.
// This file is the single source of truth: the 3D scene and the HTML
// fallback both render from it.
export const portfolio: Portfolio = {
  name: 'Diego Acero',
  tagline: 'Software engineer — somosbytes',
  projects: [
    {
      id: 'project-one',
      title: 'Project One', // TODO: real project
      description: 'Placeholder project description. Replace me.',
      url: 'https://github.com/diegoacero',
      icon: '/icons/project-one.svg',
    },
    {
      id: 'project-two',
      title: 'Project Two', // TODO: real project
      description: 'Placeholder project description. Replace me.',
      url: 'https://github.com/diegoacero',
      icon: '/icons/project-two.svg',
    },
    {
      id: 'project-three',
      title: 'Project Three', // TODO: real project
      description: 'Placeholder project description. Replace me.',
      url: 'https://github.com/diegoacero',
      icon: '/icons/project-three.svg',
    },
  ],
  substackUrl: 'https://somosbytes.substack.com', // TODO: confirm URL
  cvPdfPath: '/cv/diego-acero-cv.pdf', // placeholder file — drop the real PDF over it
  socials: [
    { label: 'GitHub', url: 'https://github.com/diegoacero' }, // TODO
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/diegoacero' }, // TODO
  ],
}
