const overview = (name: string, alt: string, caption: string) => ({
  src: `/images/overviews/${name}.png`,
  alt,
  label: 'Overview',
  caption,
})

export const projectOverviews = {
  customerSupport: overview(
    'customer-support',
    'AI Customer Support and Lead CRM presentation with support, lead capture, and follow-up workflow diagrams',
    'Support replies, lead capture, and follow-ups in one n8n project. This presentation uses diagrams rendered from the supplied workflow export. Explore the detailed views to follow each route.',
  ),
  gmailAssistant: overview(
    'gmail-assistant',
    'Gemini Gmail Assistant presentation featuring the original email agent workflow diagram',
    'A conversational email assistant with Gemini, Gmail, and session memory. This presentation uses the exported workflow diagram. Open Email assistant to inspect the connections and sending behavior.',
  ),
  jobFinder: overview(
    'job-finder',
    'PH WFH Job Finder presentation featuring job discovery and application drafting workflow diagrams',
    'Discover remote jobs, organize them in Google Sheets, and prepare application drafts for review. This presentation uses diagrams rendered from the supplied n8n export; the detailed workflow and datasheet remain available in the tabs.',
  ),
  joblink: overview(
    'joblink',
    'Joblink Tracker presentation composed from actual dashboard and application tracker screenshots',
    'A workspace for job discovery, applications, and daily planning. This presentation uses actual Joblink screenshots with fictional demo applications. Explore the original workspace and sign-in captures in the gallery.',
  ),
  plumbing: overview(
    'plumbing',
    '5S Plumbing website presentation composed from actual homepage and service page screenshots',
    'A business website that introduces plumbing services and helps visitors request a quote. This presentation uses actual website screenshots. Each original full-page capture is available in the gallery.',
  ),
  fuMedia: overview(
    'fu-media',
    'FU Media project presentation featuring a still from the file management and media streaming demo',
    'An AI-powered file management and media streaming capstone built with Python, OpenCV, and YOLO. This presentation uses the existing demo still. Open Demo video to watch the project walkthrough.',
  ),
  restaurant: overview(
    'restaurant',
    'Restaurant app design presentation with the original main menu, sushi menu, and dish detail screens',
    'A restaurant app design concept presented with its original Figma screens. Explore the main menu, sushi selection, and dish detail layouts individually in the gallery.',
  ),
  petShop: overview(
    'pet-shop',
    'Pet shop business card presentation showing the original front and back artwork',
    'A two-sided pet shop business card concept presented with its original Figma artwork. Open Front side and Back side to inspect each design at full size.',
  ),
}
