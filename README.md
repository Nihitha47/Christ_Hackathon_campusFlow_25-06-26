# CampusFlow

CampusFlow is a pnpm monorepo for a live student productivity demo with a Next.js web app, an Express API, Supabase storage/auth, and n8n automation.

## File Tree

```text
CampusFlow Hackathon/
  apps/
    api/
    web/
  docs/
    n8n/
  packages/
    shared/
    ui/
  supabase/
    migrations/
```

## Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS, shadcn-style UI primitives
- Backend: Node.js, Express, TypeScript
- Auth/Data: Supabase free tier
- Automation: n8n Cloud free tier
- Deployment: Vercel for web, Render for API

## Local Setup

1. Install Node 20+ and pnpm 9.
2. Copy `env.example` to `.env` and fill in the values.
3. Install dependencies from the repo root:

```bash
pnpm install
```

4. Apply the Supabase migration in `supabase/migrations/base.sql`.
5. Start the API and web app:

```bash
pnpm dev
```

If you want separate processes:

```bash
pnpm --filter @campusflow/api dev
pnpm --filter @campusflow/web dev
```

## Deployment

### Vercel

- Set the root directory to the repo root.
- Use `apps/web` as the project package during deployment.
- Set `NEXT_PUBLIC_API_URL` to the Render API URL.
- Keep `NEXT_PUBLIC_APP_URL` pointed at the Vercel URL.

### Render

- Use the `render.yaml` file at the repo root.
- Deploy the API from the workspace root with the `@campusflow/api` package filter.
- Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `N8N_WEBHOOK_URL`, and `N8N_WEBHOOK_SECRET` in Render environment variables.

### Supabase

- Run `supabase/migrations/base.sql` in the SQL editor or via migration tooling.
- Enable Google email/password auth in Supabase Auth.
- Make sure the profile `id` matches the Supabase user ID.

### n8n

- Create a webhook workflow that receives the automation envelope.
- Route study session events to Google Calendar and Twilio WhatsApp Sandbox.
- Route deadline and placement events to Google Calendar or WhatsApp depending on the flow.

For a deployment checklist with exact environment variables and service notes, see [docs/deployment.md](docs/deployment.md).

## Merge Checklist

1. Person 4: keep `packages/shared`, `packages/ui`, `apps/web/app/(auth)`, `apps/web/app/dashboard`, `apps/api/src/core`, root configs, `supabase/migrations/base.sql`, `render.yaml`, and `README.md`.
2. Person 3: paste the study group scheduler UI into `apps/web/app/dashboard/groups/*` and the study group backend into `apps/api/src/modules/groups/*`.
3. Person 1: own deadline modules only, including task CRUD and deadline automation hooks.
4. Person 2: own placement modules only, including placement CRUD and placement automation hooks.
5. After merging all modules, wire the shared contracts through `packages/shared` only; do not duplicate schemas in feature folders.

## Branch Strategy

- Create one branch per person, for example `feature/person-4-foundation`.
- Merge Person 4 first so everyone else can build against stable contracts.
- Merge feature branches into a single integration branch, then do a final smoke test from root.
