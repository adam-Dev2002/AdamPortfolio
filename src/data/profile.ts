import { Briefcase, SealCheck, GraduationCap, type Icon } from '@/components/slab'

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

export type Stat = { value: string; label: string; Icon: Icon }

export type Profile = {
  name: string
  firstName: string
  handle: string
  role: string
  avatarSrc: string
  email: string
  phone: string
  resumeSrc: string
  location: string
  stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: {
    body: string
    portraitSrc: string
    portraitAlt: string
  }
  socials: SocialLink[]
}

export const upworkUrl = 'https://www.upwork.com/freelancers/~01a360ba6c836da36b?viewMode=1'

export const profile: Profile = {
  name: 'Adam R. Romas',
  firstName: 'Adam',
  handle: '@adamromas',
  role: 'AI Engineer · n8n Automation',
  avatarSrc: '/images/adam-romas.jpg',
  email: 'adamromas0634@gmail.com',
  phone: '+63 965-791-3609',
  resumeSrc: '/Adam-Resume-2026.pdf',
  location: 'Dumaguete City, Philippines',
  stats: [
    { value: '6', label: 'Selected projects', Icon: Briefcase },
    { value: '3', label: 'Certifications', Icon: SealCheck },
    { value: 'BSIT', label: 'Foundation University', Icon: GraduationCap },
  ],
  displayName: { line1: 'AI engineer building', line2: 'smarter tools and workflows.' },
  hero: {
    body: 'I build AI-powered tools and intelligent workflows with Gemini, Python, and n8n. I stay current with emerging technologies through continuous learning and hands-on experimentation.',
    portraitSrc: '/images/adam-romas.jpg',
    portraitAlt: 'Adam R. Romas',
  },
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/adam-romas', iconPath: '/icons/linkedin.svg' },
    { label: 'Facebook', href: 'https://www.facebook.com/adam.rubia.2025/', iconPath: '/icons/facebook.svg' },
    { label: 'Upwork', href: upworkUrl, iconPath: '/icons/upwork.svg' },
    { label: 'GitHub', href: 'https://github.com/adam-Dev2002', iconPath: '/icons/ai/github.svg' },
  ],
}
