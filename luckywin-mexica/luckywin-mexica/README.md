# LuckyWin Mexica — Frontend

Free promotional giveaway site for Mexico. Next.js 14 (App Router) + Tailwind
CSS. Spanish-first with English toggle. Uses **Supabase Auth** for entrant
accounts (email + password) and calls the **Part 2 backend** for everything
about the promotion itself (entries, the draw, prize claiming).

## Architecture

- **Signup/login** happen directly against Supabase from the browser (via
  `supabase-js`) — this frontend talks to Supabase for auth only.
- **Everything else** (creating a profile, entering the cycle, the actual
  draw, checking prize availability, public winners) goes through the Part 2
  backend's API, authenticated with the Supabase session token.
- The old client-side mock win/lose logic has been removed — `/jugar` now
  calls the real backend, which owns the actual odds and inventory.

## Setup

### 1. Supabase

You need the same Supabase project the backend uses. From its dashboard:
**Project Settings → API** → copy the **Project URL** and **anon public key**.

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
`NEXT_PUBLIC_API_BASE_URL` (the Part 2 backend's URL — `http://localhost:4000/api`
for local dev, or your deployed backend's URL in production).

### 3. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Make sure the Part 2 backend is also running
(see its own README) — signup works standalone, but entering a cycle
requires the backend.

## Before deploying

1. **WhatsApp number** — `lib/config.js`, replace `WHATSAPP_NUMBER_PLACEHOLDER`.
2. **Legal pages** — `app/terminos/page.js` and `app/privacidad/page.js` have
   `[FECHA]` / `[DATE]` placeholders. Have these reviewed by a Mexico-licensed
   attorney before going live — this promotion likely needs SEGOB/DGJS
   registration even though it's free to enter. This is not legal advice.
3. **Environment variables on your hosting provider** (Vercel, etc.) — set
   the three `NEXT_PUBLIC_*` variables in your deployment's dashboard, not
   just locally.

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set the environment variables in the Vercel project dashboard
(Settings → Environment Variables) — they won't carry over from your local
`.env.local` automatically.

## Structure

```
app/
  page.js                Landing page
  registro/page.js        Signup (account creation + profile)
  iniciar-sesion/page.js  Login
  jugar/page.js            Play/reveal flow — calls the real backend
  ganadores/page.js       Winners page (placeholder rows until backend has real data)
  terminos/page.js        Terms & Conditions (ES/EN)
  privacidad/page.js      Privacy Policy (ES/EN)
components/              Header (with login state), Footer, WhatsApp button, PrizeCard
lib/
  config.js              Single source of truth: prizes, WhatsApp number
  LanguageContext.js      es/en toggle logic
  AuthContext.js          Supabase session state, signUp/signIn/signOut
  supabaseClient.js        Supabase browser client
  api.js                  Backend API helper (attaches auth token)
messages/
  es.json / en.json       All UI strings
```
