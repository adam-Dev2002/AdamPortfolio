# AdamPortfolio

Adam R. Romas's personal portfolio, focused on AI engineering, n8n automation, web development, and practical technology projects.

## Features

- Responsive desktop and mobile layouts with light and dark themes.
- Japanese-inspired About bento with the same AI introduction as Home, education, credentials, and a practical toolkit.
- Accessibility controls for enlarged text, high contrast, reduced motion, and underlined links.
- Colored tool icons, including Vercel for project deployment.
- Project galleries with back/close controls, zoom, and scroll restoration.
- HD workflow diagrams and explanations derived from n8n exports.
- FU Media demo video, 5S Plumbing website, restaurant app designs, and pet shop business card.
- Resume download and LinkedIn, Facebook, Upwork, and GitHub links.

## Run locally

Requires Node.js and npm.

```bash
npm ci
npm run dev
```

Vite prints the local preview URL, normally http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```

The build typechecks the app and writes production files to `dist/`. Hosting must route application paths such as `/projects` and `/showcase` to `index.html`.

### Vercel deployment

Use `adam-port/portfolio-template-main` as the Root Directory if deploying the entire workspace, or the repository root if deploying AdamPortfolio directly. Select Vite, build with `npm run build`, and use `dist` as the Output Directory. The included `vercel.json` rewrites application routes to `index.html`, allowing direct visits and refreshes on `/projects` and other React Router pages. Redeploy after uploading or pushing this configuration; existing deployments do not receive local edits automatically.

## Update content

- Profile, introduction, contact details, and social links: `src/data/profile.ts`
- Project thumbnails and galleries: `src/data/portfolio.ts`
- n8n workflow descriptions and captions: `src/data/workflows.ts`
- Images, workflow previews, and resume: `public/`
- Shared preview and card styling: `src/styles/portfolio-ui.css`

Generated workflow diagrams and screenshots are included. `node scripts/capture-workflows.mjs "<path-to-updated-workflow.json>"` renders the updated PH WFH workflow; the original Gemini Gmail Assistant export must also exist two directories above the checkout. Diagrams show node labels and connections, not live n8n executions. Raw exports and their credentials are not published.

The Joblink gallery features live 4K (3840 x 2160) screenshots of all nine workspace pages: dashboard, job search, news, applications, task board, calendar, links, sheet, and account settings. Run `node scripts/capture-joblink-authenticated.mjs` and sign in interactively to refresh them. Its dedicated browser profile is ignored by Git. `node scripts/capture-joblink.mjs` captures the public desktop and mobile sign-in screens included as additional views; authenticated screenshots are retained separately. The workbook gallery is a rendered excerpt of JOBHACK2026 (1).xlsx, with job metadata and snapshot status counts; it is not a screenshot of the Google Sheets interface. Email addresses, application messages, and draft IDs are excluded from the public excerpt.

The contact form opens the visitor's email application by default. An optional backend can be configured with `VITE_CONTACT_ENDPOINT`.

## Technology

React, TypeScript, Vite, React Router, CSS, Three.js, GSAP, and Phosphor icons. Browser preview checks use Playwright with Google Chrome.

## Template attribution

Adapted from [BrewedOps Portfolio Template](https://github.com/brewed-ops/portfolio-template). The original license and required copyright notice are retained in `LICENSE`.

## Credits

- Contour background technique inspired by the landonorris.com site by OFF+BRAND. The simplex noise is Ashima Arts / Ian McEwan (MIT).
- Icons: [Phosphor](https://phosphoricons.com) (MIT). Tool logos in `public/icons/` are trademarks of their owners and are included as examples only.
- Font: Poppins (SIL Open Font License).
- Tool brand icons: [Simple Icons](https://simpleicons.org) (CC0). Brand marks remain trademarks of their owners.

## License

[PolyForm Noncommercial 1.0.0](LICENSE), plus one extra permission: you can use it for **your own** portfolio, even if that portfolio promotes your paid services.

What it does not allow without a commercial license: selling or reselling this template, or building portfolio sites for other people for payment. For a commercial license, email brewedops@gmail.com.

Versions up to tag `v1.0.0-mit` (commit d3c05da) were MIT and stay MIT. Everything after that is under the license above.
