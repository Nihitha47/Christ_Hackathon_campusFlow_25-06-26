# n8n Workflows

This folder documents the automation layer for CampusFlow. The backend posts only to n8n webhooks, and n8n handles the external side effects.

## Workflow 1: Deadline reminders

- Trigger: backend webhook event with `DEADLINE_CREATED` or `DEADLINE_REMINDER_SCHEDULED`
- Actions:
  - create a Google Calendar event if `addToCalendar` is true
  - send a WhatsApp reminder through Twilio WhatsApp Sandbox
  - log the execution result back in CampusFlow via API logs for observability

## Workflow 2: Placement reminders

- Trigger: backend webhook event with `PLACEMENT_MILESTONE_CREATED` or `MOCK_INTERVIEW_SCHEDULED`
- Actions:
  - send a WhatsApp reminder
  - optionally create a calendar event for mock interviews
  - include fallback branch when calendar is disabled

## Workflow 3: Study session invites

- Trigger: backend webhook event with `STUDY_GROUP_CREATED` or `STUDY_SESSION_SCHEDULED`
- Actions:
  - send a WhatsApp invite to the group members
  - create a Google Calendar invite for the scheduled session
  - include agenda/topic and availability in invite content

## Expected Envelope

```json
{
  "eventType": "STUDY_SESSION_SCHEDULED",
  "moduleKey": "groups",
  "entityId": "uuid",
  "source": "campusflow-backend",
  "occurredAt": "2026-06-25T10:00:00.000Z",
  "payload": {}
}
```

## Notes

- Use the shared Gmail account only for calendar events.
- Keep every workflow free-tier friendly.
- Do not call n8n directly from the frontend.
- Verify the secret header `X-CampusFlow-Webhook-Secret` before processing each webhook.