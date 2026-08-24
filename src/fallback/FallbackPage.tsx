import { portfolio } from '../content/portfolio'
import { asset } from '../utils/asset'

interface FallbackPageProps {
  /** Visible page vs. kept in the DOM (visually hidden) for crawlers and screen readers. */
  active: boolean
  /** Shown after a WebGL context loss to explain why the classic view appeared. */
  contextLost?: boolean
  /** Offered only when WebGL works; re-enters the 3D room. */
  onEnter3d?: () => void
}

export function FallbackPage({ active, contextLost = false, onEnter3d }: FallbackPageProps) {
  return (
    <main className={active ? 'fallback' : 'sr-only'}>
      {contextLost && (
        <div className="fallback-banner" role="alert">
          The 3D room lost its graphics context, so here is the classic view.{' '}
          <button type="button" onClick={() => location.reload()}>
            Reload the page
          </button>
        </div>
      )}
      <header>
        <h1>{portfolio.name}</h1>
        <p className="fallback-tagline">{portfolio.tagline}</p>
      </header>
      <section>
        <h2>Projects</h2>
        <ul>
          {portfolio.projects.map((project) => (
            <li key={project.id}>
              <a href={project.url} target="_blank" rel="noreferrer">
                {project.title}
              </a>{' '}
              — {project.description}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Writing</h2>
        <p>
          <a href={portfolio.substackUrl} target="_blank" rel="noreferrer">
            Read the Substack
          </a>
        </p>
      </section>
      <section>
        <h2>CV</h2>
        <p>
          <a href={asset(portfolio.cvPdfPath)} target="_blank" rel="noreferrer">
            Open the CV (PDF)
          </a>
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <ul>
          {portfolio.socials.map((social) => (
            <li key={social.url}>
              <a href={social.url} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      {active && onEnter3d && (
        <button type="button" className="fallback-enter" onClick={onEnter3d}>
          Enter the 3D room →
        </button>
      )}
    </main>
  )
}
