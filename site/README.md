# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm install
```

**Note**: feel free to use the package manager of your choice.

## Local Development

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Production deploys run through `.github/workflows/deploy.yml` on push to `main`: it installs
dependencies, runs `npm run build`, applies D1 migrations, deploys the email worker, packages each
`labs/<track>/` directory into a downloadable zip under `build/downloads/`, then runs
`wrangler pages deploy build` to push to Cloudflare Pages.

`npm run build` alone only generates the static site in `build/` — it does not produce the lab zip
downloads or apply D1 migrations. To reproduce a full deploy locally, run the "Build per-track labs
zips" step from the workflow yourself before deploying with Wrangler, and make sure `CLOUDFLARE_API_TOKEN`
and `CLOUDFLARE_ACCOUNT_ID` are set.

`npm run deploy` (Docusaurus's own GitHub Pages deploy command) is not used by this project.
