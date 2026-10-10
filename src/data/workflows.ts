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
    description: 'Scans remote-job sources, saves jobs to a datasheet, and prepares Gmail drafts.',
    details: 'Scans Remotive, Himalayas, and Jobicy and stores jobs in a Google Sheets datasheet. Change a selected job’s status to Ready to Draft and add the employer email to create an application draft with your resume. Review and send it from Gmail.',
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
        caption: 'Scans job sources and saves results to the datasheet. Mark selected jobs Ready to Draft to prepare application emails, then review and send them from Gmail.',
      },
      {
        src: '/images/workflows/job-search-schedule.png',
        alt: 'Two-minute schedule with an independent eight-hour job search gate and a manual bypass',
        label: 'Search schedule',
        caption: 'Automatically checks job sources for new listings and scans the datasheet for jobs marked Ready to Draft.',
      },
      {
        src: '/images/workflows/job-discovery.png',
        alt: 'Remotive, Himalayas, and Jobicy feeds are ranked, deduplicated by tracked job ID, and appended to Sheets',
        label: 'Discover jobs',
        caption: 'Scans Remotive, Himalayas, and Jobicy and saves new jobs to Google Sheets without repeating tracked job IDs.',
      },
      {
        src: '/images/workflows/application-writing.png',
        alt: 'Google Sheets rows are checked for drafting eligibility and Gemini produces application email JSON',
        label: 'Write applications',
        caption: 'Change a job’s status to Ready to Draft and add the employer email. Gemini prepares the application subject and message.',
      },
      {
        src: '/images/workflows/resume-drafts.png',
        alt: 'Drive resume download, PDF validation, Gmail draft creation, and Sheets draft ID update',
        label: 'Attach & save',
        caption: 'Creates a Gmail draft with your resume attached and updates the datasheet to Draft Ready. Open Gmail to review and send the application.',
      },
      {
        src: '/images/workflows/job-tracker-sheet.png',
        alt: 'Rendered JOBHACK2026 workbook excerpt with job metadata and application status counts',
        label: 'Tracker datasheet',
        caption: 'The JOBHACK2026 datasheet stores job details and application status. Mark the jobs you want to apply for as Ready to Draft.',
      },
    ],
  },
]
