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
    {
      id: 'writing-critter',
      title: 'Writing Critter',
      description: 'An Omarchy bar plugin. A critter that grows as you hit your daily writing goal — it counts words from your writing apps by watching files. No keyboard access, no network.',
      url: 'https://plugins.omarchy.org/plugin.html?id=io.github.acero-ad.writing-critter',
      icon: '/icons/writing-critter.svg',
    },
  ],
  substackUrl: 'https://somosbytes.substack.com',
  cvPdfPath: '/cv/diego-acero-cv.pdf',
  socials: [
    { label: 'GitHub', url: 'https://github.com/Acero-AD' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/diego-acero-arguelles' },
  ],
}
