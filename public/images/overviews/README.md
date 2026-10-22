# Project overview covers

Eight 1600 × 1000 PNG presentation covers follow the existing Closeby overview: a dark navy canvas, left-aligned copy, tool or capability tags, and framed project imagery. Layout and frames are CSS presentation, not application UI. All visible project imagery comes from existing repository files; original assets are unchanged. No external requests are used.

Regenerate from the repository root with:

```sh
node scripts/capture-project-overviews.mjs
```

The script uses installed Playwright with Chrome (or PLAYWRIGHT_CHANNEL). Copy is based on src/data/portfolio.ts, workflows.ts, and plumbing.ts. Joblink badges describe capabilities because its stack is not documented there. Workflow images depict exported structure rather than live executions; Joblink screenshots contain labeled fictional demo applications. FU Media uses the existing demo still. Restaurant and pet shop images are original Figma SVG exports.

| Cover | Existing source assets under public/images |
| --- | --- |
| customer-support.png | `customer-support/dashboard.png`, `customer-support/leads.png` |
| gmail-assistant.png | `workflows/gmail-assistant.png` |
| job-finder.png | `workflows/job-discovery.png`, `workflows/application-writing.png` |
| joblink.png | `joblink/joblink-dashboard.png`, `joblink/joblink-applications.png` |
| plumbing.png | `5s-plumbing.jpg`, `plumbing/home.jpg` |
| fu-media.png | `fu-media.jpg` |
| restaurant.png | `designs/restaurant-menu.svg`, `designs/restaurant-sushi.svg`, `designs/restaurant-ramen.svg` |
| pet-shop.png | `designs/pet-shop-front.svg`, `designs/pet-shop-back.svg` |
