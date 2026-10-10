import type { PortfolioProject } from './portfolio'

export const workflowProjects: PortfolioProject[] = [
  {
    title: 'Gemini Gmail Assistant',
    category: 'n8n · AI email automation',
    description: 'A conversational email assistant with Gemini, Gmail, and session memory.',
    details: 'A chat trigger connects to a Gemini-powered agent, a Gmail sending tool, and a ten-message memory window. The assistant drafts messages in chat and sends a single email only when the current request explicitly asks it to send.',
    imageSrc: '/images/workflows/gmail-assistant.png',
    imageAlt: 'Five-node n8n Gemini Gmail assistant workflow',
    imageFit: 'contain',
    href: '/images/workflows/gmail-assistant.png',
    linkLabel: 'Explore workflow',
    previewWidth: 1100,
    gallery: [{
      src: '/images/workflows/gmail-assistant.png',
      alt: 'Chat trigger, Gemini email agent, Gemini model, Gmail tool, and simple memory connections',
      label: 'Email assistant',
      caption: 'A chat message starts the Gemini email agent. The Gemini model supplies language generation, Simple Memory keeps the last ten messages, and the Gmail tool sends one email when explicitly requested. Draft requests remain in chat. Scroll sideways or use zoom to follow the connections.',
    }],
  },
  {
    title: 'PH WFH Job Finder — AI Limited Version',
    category: 'n8n · Google Workspace automation',
    description: 'Three remote-job feeds, a spreadsheet review queue, and Gemini-assisted application drafts.',
    details: 'An improved n8n workflow combines Remotive, Himalayas, and Jobicy listings, ranks relevant roles, and saves untracked job IDs to the 19-column JOBHACK2026 tracker. A two-minute schedule checks for approved draft requests while an independent eight-hour gate controls automatic job discovery. Rows marked Ready to Draft with a valid employer email and no existing draft ID go to Gemini, then receive a validated PDF resume from Drive and a Gmail draft. The sheet records the subject, message, draft ID, and Draft Ready status for review before sending.',
    imageSrc: '/images/workflows/job-discovery.png',
    imageAlt: 'Updated three-source n8n job discovery and Google Sheets tracking diagram',
    imageFit: 'contain',
    href: '/images/workflows/job-discovery.png',
    linkLabel: 'Explore workflow',
    previewWidth: 1100,
    gallery: [
      {
        src: '/images/workflows/job-finder-overview.png',
        alt: 'Complete PH WFH Job Finder workflow structure from the supplied AI Limited Version n8n export',
        label: 'Full workflow',
        previewWidth: 3500,
        caption: 'Full workflow diagram rendered from PH-WFH JOB FINDER-AI LIMITED VERSION AI.json, preserving its node positions and connections. The upper branch discovers and tracks jobs; the lower branch scans approved spreadsheet rows, generates application text, attaches the resume, and saves Gmail drafts. Use the individual views for close-ups. This is a rendered export, not a live n8n execution screenshot.',
      },
      {
        src: '/images/workflows/job-search-schedule.png',
        alt: 'Two-minute schedule with an independent eight-hour job search gate and a manual bypass',
        label: 'Search schedule',
        caption: 'The published workflow ticks every two minutes. Automatic discovery runs on the first tick and then every eight hours, independently of tracker contents. Manual Run starts discovery immediately. These are diagrams rendered from the supplied n8n export, rather than screenshots of a live n8n execution.',
      },
      {
        src: '/images/workflows/job-discovery.png',
        alt: 'Remotive, Himalayas, and Jobicy feeds are ranked, deduplicated by tracked job ID, and appended to Sheets',
        label: 'Discover jobs',
        caption: 'Three public feeds supply listings: Remotive, Himalayas, and Jobicy. Code normalizes fields, ranks relevant roles with Philippines/global-location signals, and keeps up to 200 candidates. Existing job IDs prevent repeat imports. New jobs enter the tracker as New, with application-email evidence when available; Philippines eligibility still needs review.',
      },
      {
        src: '/images/workflows/application-writing.png',
        alt: 'Google Sheets rows are checked for drafting eligibility and Gemini produces application email JSON',
        label: 'Write applications',
        caption: 'The separate two-minute scan reads tracker rows and selects eligible Ready to Draft jobs with a valid employer email, a job ID, and no existing Gmail draft ID. Despite its Choose One Row name, the supplied code returns all eligible unique rows. Gemini prepares the subject and message, and a parser checks the email JSON.',
      },
      {
        src: '/images/workflows/resume-drafts.png',
        alt: 'Drive resume download, PDF validation, Gmail draft creation, and Sheets draft ID update',
        label: 'Attach & save',
        caption: 'Drive supplies the resume, a validation step checks the PDF, and Gmail creates an application draft with the attachment. Google Sheets stores the draft ID, application subject, and message, then changes Status to Draft Ready. Applications remain drafts for review; this workflow does not send them.',
      },
      {
        src: '/images/workflows/job-tracker-sheet.png',
        alt: 'Rendered JOBHACK2026 workbook excerpt with job metadata and application status counts',
        label: 'Tracker datasheet',
        caption: 'Rendered excerpt of the supplied JOBHACK2026 workbook, not a Google Sheets UI screenshot. Its three tabs are Job Tracker, Workflow Guide, and Status Summary. This snapshot contains 207 job IDs: 193 New, 1 Ready to Draft, and 13 Draft Ready. The 19-column tracker includes source, match score, employer-email evidence, application text, and draft IDs. The public preview shows only job metadata.',
      },
    ],
  },
]
