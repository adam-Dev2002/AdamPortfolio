export type QA = { q: string; a: string }

/**
 * The questions people ask before they email. One list, used by the FAQ
 * accordion on the Contact view (and the legacy long-scroll FAQ section).
 * Five questions, two or three sentences each: the accordion sits in a
 * fixed panel and more than that pushes the email row off the plate.
 */
export const FAQS: QA[] = [
  {
    q: 'What do you do?',
    a: 'My background includes responsive WordPress websites, an AI-powered media management capstone, and IT support for hardware, software, and network issues.',
  },
  {
    q: 'What experience do you have?',
    a: 'I developed a multi-page website for 5S Plumbing, led web development for the FU Media capstone, and worked in customer service at TTEC and IT support at Inspiro.',
  },
  {
    q: 'What tools and technologies have you used?',
    a: 'My project work includes WordPress, Python, OpenCV, and YOLO. My resume also highlights workstation setup, software deployment, and technical documentation.',
  },
  {
    q: 'Where are you based?',
    a: 'I am based in Dumaguete City, Negros Oriental, Philippines.',
  },
  {
    q: 'What happens after I write?',
    a: 'Include a little context about your project or support needs and I will follow up to discuss the next steps.',
  },
]
