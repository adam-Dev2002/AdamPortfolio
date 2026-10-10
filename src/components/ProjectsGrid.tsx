import { ArrowUpRight } from '@/components/slab'
import PortfolioCards from './PortfolioCards'
import PageBack from './PageBack'

import { upworkUrl } from '@/data/profile'

export default function ProjectsGrid() {
  return (
    <section className="pgrid portfolio-page" aria-labelledby="projects-title">
      <header className="pgrid__head">
        <PageBack />
        <span className="pgrid__eyebrow">Selected work</span>
        <h1 className="pgrid__title" id="projects-title">
          Projects built to be useful.
        </h1>
        <p className="pgrid__lede">
          Websites, n8n automations, an AI-powered capstone, and interface design.
        </p>
        <a className="page-back" href="https://joblink-tracker-c8zm.vercel.app/" target="_blank" rel="noopener noreferrer">
          Visit Joblink Tracker <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>

      <div className="home__glass pgrid__glass portfolio-page__glass">
        <PortfolioCards />
        <a className="portfolio-upwork" href={upworkUrl} target="_blank" rel="noopener noreferrer">
          <span>
            <strong>More work on Upwork</strong>
            <span>View Adam’s freelance profile</span>
          </span>
          <ArrowUpRight size={17} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
