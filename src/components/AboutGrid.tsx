import { GraduationCap, MapPin, SealCheck } from '@/components/slab'
import { profile } from '@/data/profile'

type Capability = {
  index: string
  title: string
}

const CAPABILITIES: Capability[] = [
  { index: '01', title: 'Web development · WordPress' },
  { index: '02', title: 'AI & computer vision · Python, OpenCV, YOLO' },
  { index: '03', title: 'IT support · hardware, software & networks' },
  { index: '04', title: 'Customer support · troubleshooting & documentation' },
  { index: '05', title: 'n8n automation · Gemini, Gmail, Sheets & Drive' },
]

export default function AboutGrid() {
  return (
    <section className="pgrid agrid" aria-labelledby="about-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">About</span>
        <h1 className="pgrid__title" id="about-title">
          {`Hi, I’m ${profile.firstName}.`}
        </h1>
        <p className="pgrid__lede">
          IT graduate, web developer, and technology support professional based in Dumaguete City.
        </p>
      </header>

      <div className="home__glass agrid__glass">
        <div className="agrid__copy">
          <p className="agrid__lead">
            I make technology useful and approachable.
            <span> From responsive websites to AI-powered media tools and dependable IT support.</span>
          </p>

          <p className="agrid__note">
            I earned a BS in Information Technology from <strong>Foundation University</strong> in
            2025. My projects include a{' '}
            <a className="agrid__link" href="https://5splumbing.com/" target="_blank" rel="noopener noreferrer">
              responsive WordPress site for 5S Plumbing
            </a>{' '}
            and FU Media, an AI-assisted image and video management capstone. I also hold the
            Certified Artificial Intelligence Professional, PhilNITS, and Cisco Cyber Threat
            Management certificates.
          </p>

          <a className="agrid__resume" href={profile.resumeSrc} download="Adam-Romas-Resume-2026.pdf">
            Download my resume <span aria-hidden="true">↗</span>
          </a>

          <ul className="agrid__caps" role="list">
            {CAPABILITIES.map((capability) => (
              <li key={capability.index} className="agrid__cap">
                <span className="agrid__cap-title">{capability.title}</span>
                <span className="agrid__cap-index" aria-hidden="true">
                  {capability.index}
                </span>
              </li>
            ))}
          </ul>

          <div className="agrid__bar">
            <span className="agrid__cell">
              <span className="agrid__cell-mark">
                <SealCheck size={18} weight="duotone" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Certified AI Professional</span>
                <span className="agrid__cell-meta">CAIP certification</span>
              </span>
            </span>

            <span className="agrid__cell">
              <span className="agrid__cell-mark">
                <MapPin size={16} weight="fill" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">{profile.location}</span>
                <span className="agrid__cell-meta">Negros Oriental · Philippines</span>
              </span>
            </span>

            <span className="agrid__cell agrid__cell--wide">
              <span className="agrid__cell-mark">
                <GraduationCap size={18} weight="duotone" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Foundation University</span>
                <span className="agrid__cell-meta">BS Information Technology · 2025 · GWA 1.6</span>
              </span>
            </span>
          </div>
        </div>

        <div className="agrid__portrait">
          <img
            src={profile.hero.portraitSrc}
            alt={profile.hero.portraitAlt}
            loading="eager"
            decoding="async"
            width={768}
            height={1152}
          />
        </div>
      </div>
    </section>
  )
}
