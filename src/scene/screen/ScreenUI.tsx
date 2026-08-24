import { portfolio } from '../../content/portfolio'
import { useScene } from '../../state/store'
import { asset } from '../../utils/asset'

// Mini OS desktop rendered as real DOM on the monitor plane. Rendered at 2x
// CSS pixels and scaled down in Pc.tsx to stay sharp on mobile Safari.
export function ScreenUI() {
  const isTransitioning = useScene((s) => s.isTransitioning)
  return (
    <div
      className="screen-ui"
      style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
      // R3F listens on the canvas container; without this, clicks inside the
      // screen bubble up, raycast into the monitor mesh behind and back() out.
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="screen-menubar">
        <span className="screen-menubar-title">somos·OS</span>
        <span>{portfolio.name}</span>
      </div>
      <div className="screen-icons">
        {portfolio.projects.map((project) => (
          <a
            key={project.id}
            className="screen-icon"
            href={project.url}
            target="_blank"
            rel="noreferrer"
            title={project.description}
          >
            <img src={asset(project.icon)} alt="" draggable={false} />
            <span>{project.title}</span>
          </a>
        ))}
      </div>
      <div className="screen-taskbar">
        <span>{portfolio.tagline}</span>
      </div>
    </div>
  )
}
