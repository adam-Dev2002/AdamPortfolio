import { ArrowUpRight } from '@/components/slab'
import PortfolioCards from './PortfolioCards'
import YoutubeDemo from './YoutubeDemo'
import PageBack from './PageBack'

import { upworkUrl } from '@/data/profile'

export default function ShowcaseGrid() {
  return (
    <section className="pgrid portfolio-showcase" aria-labelledby="showcase-title">
      <header className="pgrid__head portfolio-showcase__head">
        <PageBack />
        <span className="pgrid__eyebrow">Portfolio</span>
        <h1 className="pgrid__title" id="showcase-title">
          A closer look at my work.
        </h1>
        <p className="pgrid__lede">
          Explore my n8n workflows, watch the FU Media demo, and view my web and design projects.
        </p>
      </header>

      <YoutubeDemo />

      <div className="portfolio-showcase__projects">
        <div className="portfolio-showcase__projects-head">
          <div>
            <span className="pgrid__eyebrow">More projects</span>
            <h2>Selected work</h2>
          </div>
          <a href={upworkUrl} target="_blank" rel="noopener noreferrer">
            Upwork profile <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </a>
        </div>
        <PortfolioCards showDetails />
      </div>
    </section>
  )
}
