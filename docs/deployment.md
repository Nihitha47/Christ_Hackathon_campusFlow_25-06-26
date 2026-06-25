# CampusFlow Deployment Notes

## Vercel

- Deploy the `apps/web` app on Vercel.
- Set `NEXT_PUBLIC_API_URL` to the Render API URL.
- Set `NEXT_PUBLIC_APP_URL` to the production Vercel URL.
- Keep the web app on the free tier and avoid server-side n8n calls from the frontend.

## Render

- Deploy the API from the repo root using the `@campusflow/api` workspace package.
- Use the root `render.yaml` as the source of truth for the service.
- Set these environment variables in Render:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `N8N_WEBHOOK_URL`
  - `N8N_WEBHOOK_SECRET`
  - `N8N_TIMEOUT_MS`
  - `N8N_MAX_RETRIES`
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_WHATSAPP_FROM`
  - `TWILIO_WHATSAPP_TO`
  - `GOOGLE_CALENDAR_ID`
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

## Supabase

- Apply `supabase/migrations/base.sql` before deploying the app.
- Confirm that email/password auth is enabled.
- Confirm that the `profiles.id` value matches the Supabase auth user ID.
- Keep row-level security enabled for all tables.

## n8n

- Use a single webhook entry point from the backend.
- Trigger at least one WhatsApp or Google Calendar action in every relevant workflow.
- For study sessions, create a calendar invite and send a WhatsApp invite.
- For deadline and placement actions, send reminders through WhatsApp and optionally create a calendar event.

## Merge Order

1. Merge Person 4 foundation first.
2. Merge module owners next: deadlines, placement, and study groups.
3. Do one final smoke test after all branches are in.
