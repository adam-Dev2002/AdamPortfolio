import type { CSSProperties } from 'react'
import {
  CheckCircle,
  Code,
  Desktop,
  FileText,
  Headset,
  MagnetStraight,
  Robot,
  FlowArrow,
  Timer,
  Trophy,
  type Icon,
} from '@/components/slab'

type Stage = {
  index: string
  label: string
  body: string
  Icon: Icon
  chips: string[]
}

const STAGES: Stage[] = [
  {
    index: '01',
    label: 'Understand',
    body: 'Clarify the goal, the people using it, and the technical issue to solve.',
    Icon: MagnetStraight,
    chips: ['Listen', 'Scope', 'Prioritize'],
  },
  {
    index: '02',
    label: 'Build or troubleshoot',
    body: 'Develop the website or investigate hardware, software, and network problems.',
    Icon: Timer,
    chips: ['Web', 'Software', 'Systems'],
  },
  {
    index: '03',
    label: 'Test and document',
    body: 'Check the result, prepare the setup, and record useful troubleshooting details.',
    Icon: Trophy,
    chips: ['Validate', 'Configure', 'Document'],
  },
]

type Skill = {
  index: string
  title: string
  description: string
  chip: string
  bullets: string[]
  Icon: Icon
}

const SKILLS: Skill[] = [
  {
    index: '06',
    title: 'n8n Automation',
    description: 'Connected workflows for email assistance and job-application drafting.',
    chip: 'Automation',
    bullets: ['Gemini AI, Gmail, and chat memory', 'Google Sheets and Drive integrations'],
    Icon: FlowArrow,
  },
  {
    index: '01',
    title: 'Web Development',
    description: 'Responsive business websites and clear service pages.',
    chip: 'WordPress',
    bullets: ['Built 10+ pages for 5S Plumbing', 'WordPress and GoDaddy'],
    Icon: Code,
  },
  {
    index: '02',
    title: 'AI & Computer Vision',
    description: 'Image and video classification for a searchable media library.',
    chip: 'Capstone',
    bullets: ['Python, OpenCV, and YOLO', 'Processed 100+ media files'],
    Icon: Robot,
  },
  {
    index: '03',
    title: 'IT Troubleshooting',
    description: 'Practical hardware, software, and network support.',
    chip: 'Support',
    bullets: ['Resolved 10–15 issues per day', 'Minimized workstation downtime'],
    Icon: Desktop,
  },
  {
    index: '04',
    title: 'System Setup',
    description: 'Workstation preparation and software deployment.',
    chip: 'Configuration',
    bullets: ['Installed and configured 20+ setups', 'Supported day-to-day operations'],
    Icon: Headset,
  },
  {
    index: '05',
    title: 'Technical Documentation',
    description: 'Clear records that make future fixes easier.',
    chip: 'Knowledge sharing',
    bullets: ['Documented 50+ support cases', 'Improved repeat issue resolution'],
    Icon: FileText,
  },
]

export default function ServicesGrid() {
  return (
    <section className="pgrid sgrid" aria-labelledby="services-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Skills</span>
        <h1 className="pgrid__title" id="services-title">
          Practical technology skills.
        </h1>
        <p className="pgrid__lede">
          Web development, n8n automation, computer vision, and IT support.
        </p>
      </header>

      <div className="home__glass sgrid__glass">
        <div className="sgrid__method" aria-labelledby="method-title">
          <div className="sgrid__method-copy">
            <span className="sgrid__method-eyebrow">How I work</span>
            <h2 className="sgrid__method-title" id="method-title">
              Listen. Build. Support.
              <br />
              <span>Clear communication through delivery.</span>
            </h2>
            <p className="sgrid__method-sub">
              I pair problem-solving and collaboration with careful testing and documentation.
            </p>
          </div>

          <ol className="sgrid__stages" role="list">
            {STAGES.map(({ Icon: StageIcon, ...stage }, i) => (
              <li key={stage.index} className="sgrid__stage" style={{ '--i': i } as CSSProperties}>
                <span className="sgrid__stage-ghost" aria-hidden="true">{stage.index}</span>
                <span className="sgrid__stage-icon" aria-hidden="true">
                  <StageIcon size={22} weight="duotone" />
                </span>
                <h3 className="sgrid__stage-label">{stage.label}.</h3>
                <p className="sgrid__stage-body">{stage.body}</p>
                <ul className="sgrid__stage-chips" role="list" aria-label={`${stage.label} steps`}>
                  {stage.chips.map((chip) => (
                    <li key={chip} className="sgrid__stage-chip">{chip}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div className="sgrid__offers">
          <div className="sgrid__offers-head">
            <h2 className="sgrid__offers-title">What I bring</h2>
            <p className="sgrid__offers-sub">Based on my project and work experience.</p>
          </div>
          <ul className="bento sgrid__services" role="list">
            {SKILLS.map(({ Icon: SkillIcon, ...skill }, skillIndex) => (
              <li key={skill.title} className="bento__card sgrid__service">
                <span className="bento__head">
                  <span className="sgrid__service-top">
                    <span className="sgrid__service-mark">
                      <SkillIcon size={21} weight="duotone" aria-hidden="true" />
                    </span>
                    <span className="sgrid__service-index" aria-hidden="true">{String(skillIndex + 1).padStart(2, '0')} / {String(SKILLS.length).padStart(2, '0')}</span>
                  </span>
                  <h3 className="bento__title">{skill.title}</h3>
                  <span className="bento__desc">{skill.description}</span>
                </span>
                <span className="sgrid__chip">{skill.chip}</span>
                <ul className="sgrid__bullets" role="list">
                  {skill.bullets.map((bullet) => (
                    <li key={bullet} className="sgrid__bullet">
                      <CheckCircle size={15} weight="duotone" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
