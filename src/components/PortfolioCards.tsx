import { ArrowUpRight } from '@/components/slab'
import { useState } from 'react'
import { portfolioProjects } from '@/data/portfolio'
import ProjectPreview from './ProjectPreview'

export default function PortfolioCards({ showDetails = false }: { showDetails?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <>
    <div className="portfolio-cards">
      {portfolioProjects.map((project, index) => (
        <button
          type="button"
          key={project.title}
          className="portfolio-card"
          onClick={() => setSelected(index)}
          aria-haspopup="dialog"
          aria-label={`Preview ${project.title}`}
        >
          {project.imageSrc ? (
            <span className={`portfolio-card__media portfolio-card__media--${project.imageFit ?? 'cover'}${project.imageInset ? ' portfolio-card__media--inset' : ''}`}>
              <img src={project.imageSrc} alt={project.imageAlt ?? ''} style={{ objectPosition: project.imagePosition }} loading="lazy" decoding="async" />
            </span>
          ) : (
            <span className="portfolio-card__media portfolio-card__media--website" aria-hidden="true">
              <span className="portfolio-card__website-mark">5S</span>
              <span className="portfolio-card__website-copy">Plumbing<br />business website</span>
              <span className="portfolio-card__website-lines"><i /><i /><i /></span>
            </span>
          )}
          <span className="portfolio-card__body">
            <span className="portfolio-card__category">{project.category}</span>
            <span className="portfolio-card__title">{project.title}</span>
            <span className="portfolio-card__description">{project.description}</span>
            {showDetails && <span className="portfolio-card__details">{project.details}</span>}
            <span className="portfolio-card__link">
              {project.videoId ? 'Watch demo' : 'Explore project'}
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </span>
          </span>
        </button>
      ))}
    </div>
    {selected !== null && <ProjectPreview project={portfolioProjects[selected]} onClose={() => setSelected(null)} />}
    </>
  )
}
