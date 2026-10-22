const overview = (name: string, alt: string, caption: string) => ({
  src: `/images/overviews/${name}.png`,
  alt,
  label: 'Overview',
  caption,
})

export const projectOverviews = {
  customerSupport: overview(
    'customer-support',
    'AI Customer Support and Lead CRM presentation with actual ClearFlow demo dashboard and lead management screenshots',
    'Real ClearFlow app screenshots and workflow diagrams. Customer records, counts, and delivery states are fictional demo data.',
  ),
  gmailAssistant: overview(
    'gmail-assistant',
    'Gemini Gmail Assistant presentation featuring the original email agent workflow diagram',
    'A diagram of the email assistant workflow. Open Email assistant to see how the chat, AI model, memory, and Gmail connect.',
  ),
  jobFinder: overview(
    'job-finder',
    'PH WFH Job Finder presentation featuring job discovery and application drafting workflow diagrams',
    'Diagrams of the job-search and application workflow. Explore each step and the tracking spreadsheet in the gallery tabs.',
  ),
  joblink: overview(
    'joblink',
    'Joblink Tracker presentation composed from actual dashboard and application tracker screenshots',
    'Real Joblink screenshots with fictional demo applications. The gallery covers the workspace pages and desktop and mobile sign-in screens.',
  ),
  plumbing: overview(
    'plumbing',
    '5S Plumbing website presentation composed from actual homepage and service page screenshots',
    'Real website screenshots. Choose a gallery tab to explore the full service, company, or contact page.',
  ),
  fuMedia: overview(
    'fu-media',
    'FU Media project presentation featuring a still from the file management and media streaming demo',
    'A still from the project demonstration. Open Demo video to watch the file-management and media-streaming walkthrough.',
  ),
  restaurant: overview(
    'restaurant',
    'Restaurant app design presentation with the original main menu, sushi menu, and dish detail screens',
    'Original Figma design screens. Explore the main menu, sushi selection, and dish details in the gallery.',
  ),
  petShop: overview(
    'pet-shop',
    'Pet shop business card presentation showing the original front and back artwork',
    'Original Figma artwork. Open Front side or Back side to inspect each design at full size.',
  ),
}
