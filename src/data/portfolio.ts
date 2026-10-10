import { workflowProjects } from './workflows'

export type PortfolioProject = {
  title: string
  category: string
  description: string
  details: string
  imageSrc?: string
  imageAlt?: string
  imageFit?: 'cover' | 'contain'
  imagePosition?: string
  imageInset?: boolean
  href: string
  linkLabel: string
  external?: boolean
  gallery?: { src: string; alt: string; label: string; caption?: string; previewWidth?: number }[]
  videoId?: string
  previewWidth?: number
}

export const portfolioProjects: PortfolioProject[] = [
  ...workflowProjects,
  {
    title: 'Joblink Tracker',
    category: 'Web app · Job application tracking',
    description: 'A job-search workspace with applications, tasks, a calendar, and career news.',
    details: 'Joblink brings job discovery and daily planning into one workspace. Search listings, save opportunities, and track applications from Saved through Interview and Offer. Organize next steps on a task board, plan interviews in a Manila-time calendar, keep useful links, and manage research in an editable sheet. Career news and account settings complete the workspace. Explore every workspace page in the live 4K screenshot gallery, plus desktop and mobile sign-in views.',
    imageSrc: '/images/joblink/joblink-dashboard.png',
    imageAlt: 'Joblink Tracker dashboard showing application, interview, task, and event summaries',
    imageFit: 'cover',
    href: 'https://joblink-tracker-c8zm.vercel.app/',
    linkLabel: 'Visit Joblink Tracker',
    external: true,
    gallery: [
      { src: '/images/joblink/joblink-dashboard.png', alt: 'Joblink workspace dashboard with application and planning summaries', label: 'Dashboard', caption: 'Live dashboard screenshot captured at 3840 x 2160. Four summary cards show applications, interviews, open tasks, and upcoming events. Recent applications and next steps sit alongside shortcuts to the task board, calendar, and news.' },
      { src: '/images/joblink/joblink-jobs.png', alt: 'Joblink Explore Jobs page with search filters and job cards', label: 'Explore jobs', caption: 'Live Explore Jobs screenshot captured at 3840 x 2160. Search by keyword and feed, classify by role, and filter loaded listings by location and employment type. Listings from Remotive, Arbeitnow, and Jobicy link to their original application pages and provide a Save action.' },
      { src: '/images/joblink/joblink-news.png', alt: 'Joblink career news page with topic filters, DEV Community stories, and upcoming events', label: 'News & events', caption: 'Live news and events screenshot captured at 3840 x 2160. Career, remote-work, and productivity topics organize DEV Community stories with author attribution. Upcoming events and Philippine career-resource links support the job-search workspace.' },
      { src: '/images/joblink/joblink-applications.png', alt: 'Joblink application tracker with summary statistics, status filters, and a saved job', label: 'Applications', caption: 'Keep applications in one table with role, company, salary, notes, and a link to the original listing. Summary cards show tracked jobs, open applications, interviews, offers, and reply rate. Filter by status, add or edit an application, or export the tracker as CSV.' },
      { src: '/images/joblink/joblink-tasks.png', alt: 'Joblink task board with To do, In progress, and Done columns', label: 'Task board', caption: 'Plan job-search tasks on a board with To do, In progress, and Done lists. Add cards and lists, then move cards by dragging them or using their status menu. This live screenshot shows the empty board before tasks are added.' },
      { src: '/images/joblink/joblink-calendar.png', alt: 'Joblink monthly calendar and upcoming events panel', label: 'Calendar', caption: 'Organize interviews, deadlines, and career events in a monthly calendar. Add an event, return to Today, and review upcoming events beside the calendar. Dates and times use the Manila timezone.' },
      { src: '/images/joblink/joblink-links.png', alt: 'Joblink saved-links workspace with an Add link action', label: 'Links', caption: 'Keep job boards, company career pages, and useful resources in one place. The Add link action builds a personal collection. This screenshot shows the workspace before links are saved.' },
      { src: '/images/joblink/joblink-sheet.png', alt: 'Joblink editable research sheet with filtering, sorting, columns, attachments, and CSV export controls', label: 'Sheet', caption: 'Organize research and notes in an editable sheet with title or role, company or category, value, notes, and attachments. Add rows, filter, sort, choose columns, delete selected rows, or export CSV. Cell changes save when focus leaves the cell; this screenshot shows the initial empty sheet.' },
      { src: '/images/joblink/joblink-settings.png', alt: 'Joblink account settings with profile and password-change forms', label: 'Settings', caption: 'Account settings provide display-name editing, the linked sign-in email, and a password-change form with current, new, and confirmation fields. Users can return to job search or sign out.' },
      { src: '/images/joblink/joblink-desktop.png', alt: 'Joblink desktop sign-in page', label: 'Desktop', caption: 'Actual screenshot of the public Joblink Tracker sign-in screen. Users can continue with Google, sign in with email and password, or create an account.' },
      { src: '/images/joblink/joblink-mobile.png', alt: 'Joblink mobile sign-in page', label: 'Mobile', caption: 'Actual mobile screenshot of the Joblink sign-in screen. The application dashboard is available after authentication.' },
    ],
  },
  {
    title: '5S Plumbing',
    imageSrc: '/images/5s-plumbing.jpg',
    imageAlt: 'Screenshot of the 5S Plumbing business website homepage',
    imageFit: 'cover',
    category: 'Freelance · Web development',
    description: 'A responsive website for a plumbing business.',
    details:
      'Built with WordPress and GoDaddy, with 10+ service and information pages to improve the business’s online visibility and make its services easier to find.',
    href: 'https://5splumbing.com/',
    linkLabel: 'Visit 5S Plumbing',
    external: true,
  },
  {
    title: 'FU Media',
    category: 'Capstone · Project leader & web developer',
    description: 'An AI-powered file management and media streaming system.',
    details:
      'Built with Python, OpenCV, and YOLO to classify 100+ image and video files. Automated tagging and keyword search helped reduce manual file-searching time.',
    imageSrc: '/images/fu-media.jpg',
    videoId: 'Q8s3rW9jc6Q',
    imageAlt: 'FU Media file-management demo video thumbnail',
    imageFit: 'cover',
    href: 'https://www.youtube.com/watch?v=Q8s3rW9jc6Q',
    linkLabel: 'Watch project demo',
    external: true,
  },
  {
    title: 'Restaurant App',
    category: 'Figma · App design concept',
    description: 'A restaurant app interface design.',
    details:
      'A restaurant app concept with a main menu, sushi selection, and individual dish screens. Explore the original Figma layouts in the gallery.',
    imageSrc: '/images/designs/restaurant-logo-thumbnail.png',
    imageAlt: 'Todokeru Restaurant app logo',
    imageFit: 'contain',
    imageInset: true,
    href: '/images/designs/restaurant-cover.svg',
    linkLabel: 'View design preview',
    gallery: [
      { src: '/images/designs/restaurant-menu.svg', alt: 'Restaurant app main menu', label: 'Main menu' },
      { src: '/images/designs/restaurant-sushi.svg', alt: 'Restaurant app sushi menu', label: 'Sushi menu' },
      { src: '/images/designs/restaurant-ramen.svg', alt: 'Restaurant app ramen detail screen', label: 'Dish details' },
    ],
  },
  {
    title: 'Pet Shop Business Card',
    category: 'Figma · Graphic design',
    description: 'A two-sided business card concept for a pet shop.',
    details:
      'A print-style branding concept supplied as a Figma file, shown here with its exported design preview.',
    imageSrc: '/images/designs/pet-shop-front.svg',
    imageAlt: 'Front of the pet shop business card design',
    imageFit: 'contain',
    imageInset: true,
    href: '/images/designs/pet-shop-cover.svg',
    linkLabel: 'View design preview',
    gallery: [
      { src: '/images/designs/pet-shop-front.svg', alt: 'Pet shop business card front', label: 'Front side' },
      { src: '/images/designs/pet-shop-back.svg', alt: 'Pet shop business card back', label: 'Back side' },
    ],
  },
]
