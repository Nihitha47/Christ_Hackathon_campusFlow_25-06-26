# n8n Payload Examples

## DEADLINE_CREATED

```json
{
  "eventType": "DEADLINE_CREATED",
  "moduleKey": "deadlines",
  "entityId": "8b3a7c0f-6b77-4e43-96d6-6b0cbf4b5d91",
  "source": "campusflow-backend",
  "occurredAt": "2026-06-25T10:00:00.000Z",
  "payload": {
    "title": "DBMS assignment",
    "actorName": "Aarav Mehta",
    "dueAt": "2026-06-27T18:00:00.000Z",
    "reminderAt": "2026-06-27T17:30:00.000Z",
    "addToCalendar": true,
    "priority": "high"
  }
}
```

## DEADLINE_REMINDER_SCHEDULED

```json
{
  "eventType": "DEADLINE_REMINDER_SCHEDULED",
  "moduleKey": "deadlines",
  "entityId": "8b3a7c0f-6b77-4e43-96d6-6b0cbf4b5d91",
  "source": "campusflow-backend",
  "occurredAt": "2026-06-25T10:05:00.000Z",
  "payload": {
    "title": "DBMS assignment",
    "actorName": "Aarav Mehta",
    "dueAt": "2026-06-27T18:00:00.000Z",
    "reminderAt": "2026-06-27T17:30:00.000Z",
    "addToCalendar": true,
    "priority": "high"
  }
}
```

## PLACEMENT_MILESTONE_CREATED

```json
{
  "eventType": "PLACEMENT_MILESTONE_CREATED",
  "moduleKey": "placement",
  "entityId": "d72e9f8c-85da-44ed-96fd-6d4fdc6e68b2",
  "source": "campusflow-backend",
  "occurredAt": "2026-06-25T10:10:00.000Z",
  "payload": {
    "title": "Complete Aptitude Prep",
    "actorName": "Aarav Mehta",
    "milestone": "Aptitude practice sprint",
    "type": "assessment",
    "reminderAt": "2026-06-26T07:30:00.000Z",
    "addToCalendar": false
  }
}
```

## MOCK_INTERVIEW_SCHEDULED

```json
{
  "eventType": "MOCK_INTERVIEW_SCHEDULED",
  "moduleKey": "placement",
  "entityId": "d72e9f8c-85da-44ed-96fd-6d4fdc6e68b2",
  "source": "campusflow-backend",
  "occurredAt": "2026-06-25T10:15:00.000Z",
  "payload": {
    "title": "Mock interview with seniors",
    "actorName": "Aarav Mehta",
    "milestone": "Interview slot booked",
    "type": "mock-interview",
    "scheduleAt": "2026-06-28T15:00:00.000Z",
    "reminderAt": "2026-06-28T14:30:00.000Z",
    "addToCalendar": true
  }
}
```

## STUDY_GROUP_CREATED

```json
{
  "eventType": "STUDY_GROUP_CREATED",
  "moduleKey": "groups",
  "entityId": "a7d5fe30-2ed0-4e9d-b6f8-55f5e1e66fbc",
  "source": "campusflow-backend",
  "occurredAt": "2026-06-25T10:20:00.000Z",
  "payload": {
    "title": "DSA sprint group",
    "groupName": "DSA sprint group",
    "subject": "Data Structures",
    "branch": "CSE",
    "year": 3,
    "actorName": "Aarav Mehta"
  }
}
```

## STUDY_SESSION_SCHEDULED

```json
{
  "eventType": "STUDY_SESSION_SCHEDULED",
  "moduleKey": "groups",
  "entityId": "a7d5fe30-2ed0-4e9d-b6f8-55f5e1e66fbc",
  "source": "campusflow-backend",
  "occurredAt": "2026-06-25T10:25:00.000Z",
  "payload": {
    "title": "DSA sprint group session",
    "groupName": "DSA sprint group",
    "agenda": "Linked lists revision and live problems",
    "topic": "Linked Lists",
    "availability": "Friday 6 PM to 8 PM",
    "scheduleAt": "2026-06-28T18:00:00.000Z",
    "durationMinutes": 90,
    "addToCalendar": true
  }
}
```