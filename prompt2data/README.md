# Prompt2Data — Frontend

Next.js 16 (App Router) frontend for Prompt2Data — a chat-style app where you
upload a dataset, describe how to clean it, and download the cleaned file. See
the [root README](../README.md) for the full system overview.

## Pages

| Route         | What it is                                                        |
|---------------|-------------------------------------------------------------------|
| `/`           | Marketing landing page — hero, "how it works", features, privacy  |
| `/login`      | Google / GitHub sign-in (Firebase)                                |
| `/dashboard`  | Chat-style cleaning workspace — drop a file, prompt, get it back  |

## How the dashboard works

1. `useAuthUser` loads the signed-in user + credit balance (Firebase → `/api/auth/getUser`).
2. You attach a file (drag & drop or picker) and type a cleaning prompt.
3. The browser `POST`s the file + prompt to **`/api/clean`** with the Firebase JWT.
4. `/api/clean` verifies the token, resolves the Mongo user, and forwards the
   file to the Python backend (`PYTHON_API_URL`). The cleaned file streams back.
5. The UI shows a stats card (rows in/out, duplicates, empty rows), a preview
   table, and a download button. Credits update from the response headers.

## Design system

- **Colors:** white / gray / black base, **orange** (`--color-brand`) primary,
  **green** (`--color-grass`) for success + credits.
- **Animations:** scroll-reveal (`Reveal`), fade/slide/scale entrances, floating
  blobs, animated gradient text, typing-dot indicator — all in `globals.css`.
- **Tailwind v4** with custom theme tokens (`bg-brand`, `text-grass`, etc.).

## Key files

```
src/
├── app/
│   ├── page.tsx            landing page
│   ├── login/page.tsx      auth
│   ├── dashboard/page.tsx  chat cleaning UI
│   ├── layout.tsx          fonts + root layout
│   ├── globals.css         design tokens + animations
│   └── api/
│       ├── clean/route.ts  JWT verify → proxy to Python /clean
│       └── auth/*          Firebase auth + user routes
├── component/
│   ├── layout/Navbar.tsx   landing navbar
│   └── ui/Reveal.tsx       scroll-reveal wrapper
├── lib/
│   ├── auth.ts             Firebase login/logout + token helpers
│   ├── useAuthUser.ts      client hook: current user + credits
│   ├── firebase.ts         Firebase client SDK
│   ├── firebaseAdmin.ts    firebase-admin (server)
│   └── DB.ts               MongoDB (mongoose) connection
└── models/User.ts          User schema (uid, email, credits, plan)
```

## Setup

```bash
npm install
cp .env.local.example .env.local   # Firebase keys, MONGO_URI, PYTHON_API_URL
npm run dev                        # http://localhost:3000
```

`MONGO_URI` **must** match the Python backend's, and `PYTHON_API_URL` must point
at the running FastAPI service (default `http://localhost:8000`).
