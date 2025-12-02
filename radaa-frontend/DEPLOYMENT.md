# Radaa Frontend Deployment

## 1. Prerequisites

- Node.js 20.x
- npm 10.x
- Backend API reachable at the URL configured in `NEXT_PUBLIC_API_URL`

## 2. Environment variables

Set these for local and Vercel environments:

- `NEXT_PUBLIC_API_URL` – base URL of the backend API (e.g. `https://radaa-1.onrender.com/api`).
- `NEXT_PUBLIC_SOCKET_URL` – websocket base URL for realtime (e.g. `wss://radaa-1.onrender.com`).

## 3. Install, build, and test

From the `radaa-frontend` directory:

```bash
npm ci
npm run build
npm test
```

## 4. Vercel configuration

- Framework: **Next.js** (App Router)
- Root directory: `radaa-frontend`
- Build command: `npm run build`
- Output directory: `.next`

## 5. CI expectations

GitHub Actions workflow at `.github/workflows/ci.yml` will:

- Install dependencies with `npm ci`.
- Run `npm run build`.
- Run `npm test`.

All three must succeed before deploying.

## 6. Manual smoke checks after deploy

After a successful deployment, verify:

1. Login/logout works for passenger, driver, and SACCO admin.
2. `/dashboard/passenger/live` shows nearby matatus and the swipe deck when `ui_revamp_v1` is enabled.
3. `/dashboard/driver/live` updates driver location and shows incoming requests.
4. `/map` shows live matatus and route search works.
5. `/track/[id]` shows live tracking for a known matatu id.
