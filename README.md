# AdamPortfolio

Adam R. Romas's personal portfolio, focused on AI engineering, n8n automation, web development, and practical technology projects.

## Features

- Responsive desktop and mobile layouts with light and dark themes.
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

## Update content

- Profile, introduction, contact details, and social links: `src/data/profile.ts`
- Project thumbnails and galleries: `src/data/portfolio.ts`
- n8n workflow descriptions and captions: `src/data/workflows.ts`
- Images, workflow previews, and resume: `public/`
- Shared preview and card styling: `src/styles/portfolio-ui.css`

Generated workflow images are included. Regenerating them with `scripts/capture-workflows.mjs` requires the original n8n JSON exports in the external references folder used during development. Those exports are not included in this repository.

The contact form opens the visitor's email application by default. An optional backend can be configured with `VITE_CONTACT_ENDPOINT`.

## Technology

React, TypeScript, Vite, React Router, CSS, Three.js, GSAP, and Phosphor icons. Browser preview checks use Playwright with Google Chrome.

## Template attribution

Adapted from [BrewedOps Portfolio Template](https://github.com/brewed-ops/portfolio-template). The original license and required copyright notice are retained in `LICENSE`.

## Credits

- Contour background technique inspired by the landonorris.com site by OFF+BRAND. The simplex noise is Ashima Arts / Ian McEwan (MIT).
- Icons: [Phosphor](https://phosphoricons.com) (MIT). Tool logos in `public/icons/` are trademarks of their owners and are included as examples only.
- Font: Poppins (SIL Open Font License).

## License

[PolyForm Noncommercial 1.0.0](LICENSE), plus one extra permission: you can use it for **your own** portfolio, even if that portfolio promotes your paid services.

What it does not allow without a commercial license: selling or reselling this template, or building portfolio sites for other people for payment. For a commercial license, email brewedops@gmail.com.

Versions up to tag `v1.0.0-mit` (commit d3c05da) were MIT and stay MIT. Everything after that is under the license above.
