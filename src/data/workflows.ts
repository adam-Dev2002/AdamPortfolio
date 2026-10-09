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
    title: 'Remote Job Search & Application Drafts',
    category: 'n8n · Google Workspace automation',
    description: 'Remote-job tracking and Gemini-written Gmail drafts with a resume attachment.',
    details: 'Manual and 8 AM triggers start job discovery and application-drafting branches. The workflow ranks remote listings, avoids tracked job IDs, saves new jobs in Google Sheets, and prepares Gmail drafts for rows marked Ready to Draft. Google Drive provides the resume, a code step validates the PDF, and the draft ID is recorded in the tracker.',
    imageSrc: '/images/workflows/job-discovery.png',
    imageAlt: 'n8n remote-job discovery and Google Sheets tracking workflow',
    imageFit: 'contain',
    href: '/images/workflows/job-discovery.png',
    linkLabel: 'Explore workflow',
    previewWidth: 1100,
    gallery: [
      {
        src: '/images/workflows/job-discovery.png',
        alt: 'Manual and scheduled triggers fetch jobs, rank matches, remove duplicates, and append new jobs to Sheets',
        label: 'Discover jobs',
        caption: 'A manual run or the 8 AM schedule fetches remote jobs from Remotive. A code step ranks matches across IT support, customer service, administration, AI/automation, and web/QA. Existing job IDs are read from Google Sheets; only untracked jobs are appended. Both triggers also start the separate drafting branch.',
      },
      {
        src: '/images/workflows/application-writing.png',
        alt: 'Google Sheets rows are checked for drafting eligibility and Gemini produces application email JSON',
        label: 'Write applications',
        caption: 'The drafting branch reads tracker rows, keeps jobs marked Ready to Draft with a valid recipient and job URL, and skips rows with an existing draft ID. Gemini writes the application subject and body, then a parsing step validates the returned JSON before the resume steps.',
      },
      {
        src: '/images/workflows/resume-drafts.png',
        alt: 'Drive resume download, PDF validation, Gmail draft creation, and Sheets draft ID update',
        label: 'Attach & save',
        caption: 'Google Drive downloads the resume. A validation step checks that the attachment is a PDF, Gmail creates a draft with the resume attached, and Google Sheets records the draft ID. The workflow stops at draft creation so the application can be reviewed before sending.',
      },
    ],
  },
]
