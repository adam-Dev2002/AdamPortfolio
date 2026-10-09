import { Briefcase, GraduationCap, Medal, Wrench } from '@/components/slab'
import { profile } from '@/data/profile'

const EXPERIENCE = [
  {
    name: 'TTEC',
    role: 'Customer Service Representative',
    dates: 'February – June 2026',
    description:
      'Resolved 10–15 hardware, software, and network issues daily; configured 20+ system setups and software deployments; and documented 50+ troubleshooting cases.',
    Icon: Briefcase,
  },
  {
    name: 'Inspiro',
    role: 'IT Intern',
    dates: 'February – April 2025',
    description:
      'Resolved 10–15 daily IT issues, installed and configured 20+ system setups, and documented 50+ troubleshooting cases and system configurations.',
    Icon: Wrench,
  },
]

const CERTIFICATIONS = [
  'Certified Artificial Intelligence Professional (CAIP)',
  'PhilNITS Certification — Passer',
  'Cisco Cyber Threat Management',
]

export default function TestimonialsGrid() {
  return (
    <section className="pgrid xgrid" aria-labelledby="experience-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Experience</span>
        <h1 className="pgrid__title" id="experience-title">
          People-first support, backed by hands-on technical work.
        </h1>
        <p className="pgrid__lede">
          Customer service, IT support, university projects, and continued learning.
        </p>
      </header>

      <div className="home__glass xgrid__glass">
        <section className="xgrid__education" aria-labelledby="education-title">
          <span className="xgrid__icon"><GraduationCap size={24} weight="duotone" aria-hidden="true" /></span>
          <span className="pgrid__eyebrow">Education</span>
          <h2 id="education-title">Foundation University</h2>
          <p className="xgrid__role">BS in Information Technology</p>
          <p className="xgrid__meta">May 2025 · Dumaguete City, Philippines</p>
          <p className="xgrid__result">GWA 1.6 · Dean’s Honors List</p>

          <div className="xgrid__certs">
            <span className="xgrid__cert-heading"><Medal size={17} weight="duotone" aria-hidden="true" /> Certifications</span>
            <ul>
              {CERTIFICATIONS.map((certificate) => <li key={certificate}>{certificate}</li>)}
            </ul>
          </div>
        </section>

        <section className="xgrid__work" aria-labelledby="work-title">
          <div className="xgrid__work-head">
            <span className="pgrid__eyebrow">Work experience</span>
            <h2 id="work-title">Support &amp; service</h2>
          </div>
          <div className="xgrid__roles">
            {EXPERIENCE.map(({ Icon, ...job }, index) => (
              <article key={job.name} className="xgrid__job">
                <span className="xgrid__job-index" aria-hidden="true">0{index + 1}</span>
                <span className="xgrid__job-icon"><Icon size={21} weight="duotone" aria-hidden="true" /></span>
                <div className="xgrid__job-copy">
                  <div className="xgrid__job-head">
                    <h3>{job.name}</h3>
                    <span>{job.dates}</span>
                  </div>
                  <p className="xgrid__role">{job.role}</p>
                  <p className="xgrid__description">{job.description}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="xgrid__soft-skills">
            Problem solving · Collaboration · Leadership · Time management · Adaptability
          </p>
          <a className="xgrid__email" href={`mailto:${profile.email}`}>{profile.email}</a>
        </section>
      </div>
    </section>
  )
}
