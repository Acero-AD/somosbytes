export interface Project {
  id: string
  title: string
  description: string
  /** External URL (GitHub repo, live demo, …) */
  url: string
  /** Icon path under public/, e.g. '/icons/foo.svg' */
  icon: string
}

export interface Social {
  label: string
  url: string
}

export interface Portfolio {
  name: string
  tagline: string
  projects: Project[]
  substackUrl: string
  /** PDF path under public/, e.g. '/cv/diego-acero-cv.pdf' */
  cvPdfPath: string
  socials: Social[]
}
