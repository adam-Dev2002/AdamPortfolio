import { workflowProjects } from './workflows'
import { plumbingGallery } from './plumbing'
import { projectOverviews } from './projectOverviews'

export type PortfolioProject = {
  title: string
  featured?: boolean
  tools?: string[]
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
  gallery?: { src: string; alt: string; label: string; caption?: string; previewWidth?: number; videoId?: string }[]
  videoId?: string
  previewWidth?: number
}

export const portfolioProjects: PortfolioProject[] = [
  ...workflowProjects,
  {
    title: 'Closeby',
    category: 'Mobile app · GPS & location sharing',
    tools: ['React Native', 'Expo', 'TypeScript', 'Firebase'],
    description: 'Find your phone, record trips, and choose to share your location with family or friends.',
    details: 'Built for Android and iOS with React Native and Expo. Closeby brings GPS maps, trip history, saved places, speed alerts, and private family spaces into a dark mobile interface. Location and history sharing are opt-in, and local GPS works without an account. Shared spaces and chat use a configured Firebase backend. Explore the app screenshots, then visit GitHub for source code and setup instructions.',
    imageSrc: '/images/closeby/closeby-overview.png',
    imageAlt: 'Closeby overview composed from actual mobile app screenshots',
    imageFit: 'contain',
    href: 'https://github.com/adam-Dev2002/closeby',
    linkLabel: 'View Closeby on GitHub',
    external: true,
    gallery: [
      { src: '/images/closeby/closeby-overview.png', alt: 'Closeby overview composed from actual mobile app screenshots', label: 'Overview', caption: 'A presentation composed from real Closeby app captures. Explore the individual screens for GPS maps, activity history, private spaces, safety controls, and settings. Locations and routes shown in this gallery are local test data.' },
      { src: '/images/closeby/closeby-map.png', alt: 'Closeby Android emulator showing a satellite map, GPS status, and My Phone device card', label: 'Android map', previewWidth: 320, caption: 'Android emulator screenshot from the Closeby repository. The satellite map, GPS status, phone battery, accuracy, and trip controls show the app with an emulator-supplied test location, not a physical phone location.' },
      { src: '/images/closeby/closeby-history.png', alt: 'Closeby History and Activity with a local test route, daily distance, duration, stops, and timeline', label: 'Activity history', previewWidth: 320, caption: 'Browser screenshot from the Closeby repository showing History & Activity with local test data. Member selection, daily distance and duration, a route map, and a movement/stop timeline demonstrate the interface. Names and routes shown are test fixtures.' },
      { src: '/images/closeby/closeby-spaces.png', alt: 'Closeby private Spaces screen captured in local browser mode', label: 'Spaces', previewWidth: 320, caption: 'Fresh local browser capture of Spaces. A configured Firebase account is required to create or join a private space, share locations with members, and use group chat. This local preview does not connect to a live family space.' },
      { src: '/images/closeby/closeby-safety.png', alt: 'Closeby Safety screen with speed, trip distance, and emergency alert controls', label: 'Safety', previewWidth: 320, caption: 'Fresh local browser capture of Safety with a fixed test GPS location. The interface brings speed, trip distance, and emergency alert controls together. Shared emergency alerts require a configured Firebase backend.' },
      { src: '/images/closeby/closeby-settings.png', alt: 'Closeby Settings with profile controls, speed alert toggle, speed limit, and emergency alert settings', label: 'Settings', previewWidth: 320, caption: 'Fresh local browser capture of Settings and speed controls. The visible screen includes the local profile, optional speed alerts, an 80 km/h speed limit, and entry points for emergency alerts and voice/video calls. Speed alerts are off in this preview.' },
      { src: '/images/closeby/closeby-sign-in.png', alt: 'Closeby account sign-in screen captured in the local browser preview', label: 'Sign in', previewWidth: 320, caption: 'Fresh local browser capture of the Closeby account screen. The app supports account access alongside local GPS mode; Google and email authentication require Firebase provider configuration. No personal account was used for this capture.' },
    ],
  },
  {
    title: 'Joblink Tracker',
    category: 'Web app · Job application tracking',
    description: 'A job-search workspace with applications, tasks, a calendar, and career news.',
    details: 'Joblink brings job discovery and daily planning into one workspace. Search listings, save opportunities, and track applications from Saved through Interview and Offer. Organize next steps on a task board, plan interviews in a Manila-time calendar, keep useful links, and manage research in an editable sheet. Career news and account settings complete the workspace. Explore every workspace page in the live 4K screenshot gallery, plus desktop and mobile sign-in views.',
    imageSrc: projectOverviews.joblink.src,
    imageAlt: projectOverviews.joblink.alt,
    imageFit: 'contain',
    href: 'https://joblink-tracker-c8zm.vercel.app/',
    linkLabel: 'Visit Joblink Tracker',
    external: true,
    gallery: [
      projectOverviews.joblink,
      { src: '/images/joblink/joblink-dashboard.png', alt: 'Joblink workspace dashboard with application and planning summaries', label: 'Dashboard', caption: 'Live dashboard with clearly labeled demo applications. Summary cards show applications, interviews, open tasks, and upcoming events, with recent applications and shortcuts below. Demo outcomes are fictional.' },
      { src: '/images/joblink/joblink-jobs.png', alt: 'Joblink Explore Jobs page with search filters and job cards', label: 'Explore jobs', caption: 'Live Explore Jobs screenshot captured at 3840 x 2160. Search by keyword and feed, classify by role, and filter loaded listings by location and employment type. Listings from Remotive, Arbeitnow, and Jobicy link to their original application pages and provide a Save action.' },
      { src: '/images/joblink/joblink-news.png', alt: 'Joblink career news page with topic filters, DEV Community stories, and upcoming events', label: 'News & events', caption: 'Live news and events screenshot captured at 3840 x 2160. Career, remote-work, and productivity topics organize DEV Community stories with author attribution. Upcoming events and Philippine career-resource links support the job-search workspace.' },
      { src: '/images/joblink/joblink-applications.png', alt: 'Joblink application tracker populated with eight clearly labeled fictional demo applications', label: 'Applications', previewWidth: 1280, caption: 'Eight fictional demo applications show every status from Saved to Offer, Rejected, and Ghosted. The table includes company, salary, date, notes, and listing links, with summary statistics above. Export CSV downloads the tracked application data.' },
      { src: '/images/joblink/joblink-export.png', alt: 'CSV preview showing the eight demo applications downloaded from Joblink', label: 'CSV export', previewWidth: 1280, caption: 'Preview rendered from an actual Joblink CSV download. All eight demo applications and their statuses were verified in the export. This preview shows only fictional demo records; it is not an Excel or Google Sheets screenshot.' },
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
    tools: ['WordPress', 'GoDaddy'],
    imageSrc: projectOverviews.plumbing.src,
    imageAlt: projectOverviews.plumbing.alt,
    imageFit: 'contain',
    category: 'Freelance · Web development',
    description: 'A plumbing business website with service pages, reviews, and quote requests.',
    details:
      'Built with WordPress and GoDaddy to introduce the business, explain its services, share customer reviews, and help visitors request a quote. Explore the full-page screenshots in the gallery.',
    href: 'https://5splumbing.com/',
    linkLabel: 'Visit 5S Plumbing',
    external: true,
    gallery: [projectOverviews.plumbing, ...plumbingGallery],
    previewWidth: 1280,
  },
  {
    title: 'FU Media',
    tools: ['Python', 'OpenCV', 'YOLO'],
    category: 'Capstone · Project leader & web developer',
    description: 'An AI-powered file management and media streaming system.',
    details:
      'Built with Python, OpenCV, and YOLO to classify 100+ image and video files. Automated tagging and keyword search helped reduce manual file-searching time.',
    imageSrc: projectOverviews.fuMedia.src,
    videoId: 'Q8s3rW9jc6Q',
    imageAlt: projectOverviews.fuMedia.alt,
    imageFit: 'contain',
    href: 'https://www.youtube.com/watch?v=Q8s3rW9jc6Q',
    linkLabel: 'Watch project demo',
    external: true,
    gallery: [
      projectOverviews.fuMedia,
      { src: '/images/fu-media.jpg', alt: 'FU Media file-management demo video thumbnail', label: 'Demo video', videoId: 'Q8s3rW9jc6Q' },
    ],
  },
  {
    title: 'Restaurant App',
    tools: ['Figma'],
    category: 'Figma · App design concept',
    description: 'A restaurant app interface design.',
    details:
      'A restaurant app concept with a main menu, sushi selection, and individual dish screens. Explore the original Figma layouts in the gallery.',
    imageSrc: projectOverviews.restaurant.src,
    imageAlt: projectOverviews.restaurant.alt,
    imageFit: 'contain',
    href: '/images/designs/restaurant-cover.svg',
    linkLabel: 'View design preview',
    gallery: [
      projectOverviews.restaurant,
      { src: '/images/designs/restaurant-menu.svg', alt: 'Restaurant app main menu', label: 'Main menu' },
      { src: '/images/designs/restaurant-sushi.svg', alt: 'Restaurant app sushi menu', label: 'Sushi menu' },
      { src: '/images/designs/restaurant-ramen.svg', alt: 'Restaurant app ramen detail screen', label: 'Dish details' },
    ],
  },
  {
    title: 'Pet Shop Business Card',
    tools: ['Figma'],
    category: 'Figma · Graphic design',
    description: 'A two-sided business card concept for a pet shop.',
    details:
      'A print-style branding concept supplied as a Figma file, shown here with its exported design preview.',
    imageSrc: projectOverviews.petShop.src,
    imageAlt: projectOverviews.petShop.alt,
    imageFit: 'contain',
    href: '/images/designs/pet-shop-cover.svg',
    linkLabel: 'View design preview',
    gallery: [
      projectOverviews.petShop,
      { src: '/images/designs/pet-shop-front.svg', alt: 'Pet shop business card front', label: 'Front side' },
      { src: '/images/designs/pet-shop-back.svg', alt: 'Pet shop business card back', label: 'Back side' },
    ],
  },
]
