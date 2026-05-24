# Deploy LoreWrite (permanent public URL)

Cloudflare quick tunnels (`trycloudflare.com`) often fail with **Error 1033** — they are temporary and not meant for production.

## Recommended: Vercel (free, stable link)

1. Push this repo to GitHub (branch `cursor/lorewrite-mvp-53c8` or merge to `main`).
2. Go to [https://vercel.com/new](https://vercel.com/new) and import the repository.
3. Leave framework as **Next.js** and click **Deploy**.
4. Your app will be live at `https://your-project.vercel.app`.

No Supabase keys are required for test mode — the app uses browser storage as backup when server files are not available.

## Run on your own computer (always works)

```bash
npm install
npm run build
npm run start
```

Open **http://localhost:3000** in Chrome or Safari (full browser window, not an embedded preview).
