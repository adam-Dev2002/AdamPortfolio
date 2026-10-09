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
  gallery?: { src: string; alt: string; label: string; caption?: string }[]
  videoId?: string
  previewWidth?: number
}

export const portfolioProjects: PortfolioProject[] = [
  ...workflowProjects,
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
