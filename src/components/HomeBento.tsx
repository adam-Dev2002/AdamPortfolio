import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Briefcase,
  EnvelopeSimple,
  FolderOpen,
  Play,
  Robot,
  FlowArrow,
  Stack,
  User,
  type Icon,
} from '@/components/slab'
import { profile } from '@/data/profile'

function CardHead({
  Icon,
  title,
  desc,
}: {
  Icon: Icon
  title: string
  desc: string
}) {
  return (
    <header className="bento__head">
      <span className="bento__label">
        <span className="bento__icon">
          <Icon size={20} weight="fill" aria-hidden="true" />
        </span>
        <h3 className="bento__title">{title}</h3>
      </span>
      <p className="bento__desc">{desc}</p>
      <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
    </header>
  )
}

const EXPERIENCE = [
  { name: 'TTEC', role: 'Customer Service Representative', date: 'Feb–Jun 2026' },
  { name: 'Inspiro', role: 'IT Intern', date: 'Feb–Apr 2025' },
]

const SKILLS: { title: string; Icon: Icon }[] = [
  { title: 'Web development', Icon: Stack },
  { title: 'AI & computer vision', Icon: Robot },
  { title: 'n8n automation', Icon: FlowArrow },
]

export default function HomeBento() {
  return (
    <nav className="bento" aria-label="Explore Adam's portfolio">
      <Link to="/projects" className="bento__card bento__card--projects">
        <CardHead Icon={FolderOpen} title="Projects" desc="Web, n8n automation, and design work." />
        <div className="bento__media bento__reel" aria-hidden="true">
          <div className="bento__reel-track">
            {['/images/workflows/gmail-assistant.png', '/images/5s-plumbing.jpg', '/images/designs/pet-shop-front.svg'].map((src) => (
              <span key={src} className="bento__shot">
                <img src={src} alt="" loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </div>
      </Link>

      <Link to="/about" className="bento__card bento__card--about">
        <CardHead Icon={User} title="About" desc="BSIT graduate based in Dumaguete City." />
        <div className="bento__media bento__fan" aria-hidden="true">
          <span className="bento__photo">
            <img src={profile.avatarSrc} alt="" loading="lazy" decoding="async" />
          </span>
        </div>
      </Link>

      <Link to="/services" className="bento__card bento__card--services">
        <CardHead Icon={Stack} title="Skills" desc="A practical mix of software and support." />
        <ul className="bento__media bento__offers" role="list">
          {SKILLS.map(({ title, Icon }, i) => (
            <li key={title} className="bento__offer" style={{ '--i': i } as CSSProperties}>
              <span className="bento__offer-tile">
                <Icon size={15} weight="duotone" aria-hidden="true" />
              </span>
              <span className="bento__offer-text">
                <span className="bento__offer-title">{title}</span>
                <span className="bento__offer-note">
                  {i === 0 ? 'WordPress websites' : i === 1 ? 'Python · OpenCV · YOLO' : 'Gemini · Gmail · Google Sheets'}
                </span>
              </span>
              <span className="bento__offer-num" aria-hidden="true">0{i + 1}</span>
            </li>
          ))}
        </ul>
      </Link>

      <Link to="/testimonials" className="bento__card bento__card--quotes">
        <CardHead Icon={Briefcase} title="Experience" desc="Customer service, IT support, and hands-on projects." />
        <div className="bento__media bento__reviews">
          <div className="bento__reviews-track">
            {EXPERIENCE.map((item) => (
              <span key={item.name} className="bento__review">
                <span className="bento__review-top"><b>{item.name}</b></span>
                <span className="bento__review-role">{item.role}</span>
                <span className="bento__review-work">{item.date}</span>
              </span>
            ))}
          </div>
        </div>
      </Link>

      <Link to="/showcase" className="bento__card bento__card--ai">
        <CardHead Icon={Play} title="Video demo" desc="See FU Media, my AI-powered media manager capstone." />
        <div className="bento__media bento__fan" aria-hidden="true">
          <span className="bento__photo">
            <img src="/images/fu-media.jpg" alt="" loading="lazy" decoding="async" />
          </span>
        </div>
      </Link>

      <Link to="/contact" className="bento__card bento__card--creds">
        <CardHead Icon={EnvelopeSimple} title="Contact" desc={profile.email} />
        <div className="bento__media bento__badge">
          <span className="bento__badge-tag">{profile.phone}</span>
        </div>
      </Link>
    </nav>
  )
}
