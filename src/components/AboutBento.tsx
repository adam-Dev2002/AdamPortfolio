import { Link } from 'react-router-dom'
import { ArrowUpRight, Code, FlowArrow, GraduationCap, MapPin, Robot, SealCheck, Wrench } from '@/components/slab'
import { profile } from '@/data/profile'
import PageBack from './PageBack'

const capabilities = [
  { title: 'AI & computer vision', detail: 'Gemini · Python · OpenCV · YOLO', Icon: Robot },
  { title: 'Workflow automation', detail: 'n8n · Gmail · Google Sheets · Drive', Icon: FlowArrow },
  { title: 'Web & deployment', detail: 'WordPress · GoDaddy · Vercel', Icon: Code },
  { title: 'IT support', detail: 'Hardware · software · networks', Icon: Wrench },
]

export default function AboutBento() {
  return (
    <section className="pgrid about-page" aria-labelledby="about-title">
      <header className="pgrid__head">
        <PageBack />
        <span className="pgrid__eyebrow">About / A little more about me</span>
        <h1 className="pgrid__title" id="about-title">Hi, I’m {profile.firstName}.</h1>
        <p className="pgrid__lede">{profile.role} · {profile.location}</p>
      </header>

      <div className="about-bento">
        <article className="about-card about-card--intro">
          <div className="about-card__label"><span>01 / Introduction</span><span className="about-stamp" aria-hidden="true">学</span></div>
          <h2 className="about-intro__title">{profile.displayName.line1} {profile.displayName.line2}</h2>
          <p className="about-intro__body">{profile.hero.body}</p>
          <div className="about-card__actions">
            <a className="about-action" href={profile.resumeSrc} download="Adam-Romas-Resume-2026.pdf">Download my resume <ArrowUpRight size={16} aria-hidden="true" /></a>
            <Link className="about-text-link" to="/projects">Explore my work <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        </article>

        <figure className="about-card about-card--portrait">
          <div className="about-portrait__frame"><img src={profile.hero.portraitSrc} alt={profile.hero.portraitAlt} width={768} height={1152} decoding="async" /></div>
          <figcaption>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
            <span className="about-portrait__location"><MapPin size={14} aria-hidden="true" /> Dumaguete City, Philippines</span>
          </figcaption>
        </figure>

        <article className="about-card about-card--focus">
          <span className="about-card__label">02 / My focus</span>
          <h2>Useful AI. Connected workflows.</h2>
          <p>I work on email assistants, searchable media libraries, and automations that connect everyday tools.</p>
          <div className="about-tool-row" aria-label="Core tools">
            {['n8n', 'python', 'opencv'].map(tool => <span key={tool} className="about-tool"><img src={`/icons/tools/${tool}.svg`} alt={tool === 'opencv' ? 'OpenCV' : tool === 'python' ? 'Python' : 'n8n'} width={24} height={24} /></span>)}
            <span className="about-tool-row__note">Build. Test. Keep learning.</span>
          </div>
        </article>

        <article className="about-card about-card--education">
          <span className="about-card__label">03 / Foundation</span>
          <GraduationCap className="about-card__symbol" size={28} weight="duotone" aria-hidden="true" />
          <h2>Foundation University</h2>
          <p>BS in Information Technology</p>
          <div className="about-facts"><span>Graduated 2025</span><strong>GWA 1.6</strong></div>
          <span className="about-card__note">Dean’s Honors List</span>
        </article>

        <article className="about-card about-card--skills">
          <span className="about-card__label">04 / What I work with</span>
          <h2>A practical toolkit.</h2>
          <ul className="about-capabilities">
            {capabilities.map(({ Icon, title, detail }) => (
              <li key={title}><span className="about-capability__icon"><Icon size={21} weight="duotone" aria-hidden="true" /></span><span><strong>{title}</strong><span>{detail}</span></span></li>
            ))}
          </ul>
        </article>

        <article className="about-card about-card--credentials">
          <span className="about-card__label">05 / Continued learning</span>
          <h2>Learning with purpose.</h2>
          <ul className="about-certificates">
            {['Certified Artificial Intelligence Professional (CAIP)', 'PhilNITS Certification — Passer', 'Cisco Cyber Threat Management'].map(certificate => <li key={certificate}><SealCheck size={19} weight="duotone" aria-hidden="true" /><span>{certificate}</span></li>)}
          </ul>
        </article>

        <div className="about-card about-card--connect">
          <div><span className="about-card__label">Let’s connect</span><h2>Have something in mind?</h2></div>
          <Link className="about-action" to="/contact">Start a conversation <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  )
}
