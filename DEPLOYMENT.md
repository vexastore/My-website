# Static Deployment

This project is ready for static hosting on Netlify, Cloudflare Pages, or any static host.

## Production Build

```bash
npm install
npm run build
```

The generated static output is:

```text
dist/
  index.html
```

Upload the full `dist` folder to your hosting provider.

## Netlify

Netlify will use `netlify.toml` automatically.

- Build command: `npm run build`
- Publish directory: `dist`

## Cloudflare Pages

Use these settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`

## GitHub Actions for Cloudflare Pages

The workflow file is included at:

```text
.github/workflows/deploy-cloudflare-pages.yml
```

Add these GitHub repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The Cloudflare Pages project name is currently set to:

```text
vexa-store
```

Change it in the workflow file if your Cloudflare Pages project uses another name.