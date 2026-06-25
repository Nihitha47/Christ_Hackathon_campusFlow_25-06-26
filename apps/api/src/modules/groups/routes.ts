import { Router } from "express";
import { AppError } from "../../core/errors";
import {
  addGroupMember,
  createGroup,
  createSession,
  deleteGroup,
  deleteSession,
  listGroupMembers,
  listGroupsByOwner,
  listSessions,
  updateGroup,
  updateSession
} from "./repository";
import {
  addStudyGroupMemberSchema,
  createStudyGroupSchema,
  createStudySessionSchema,
  updateStudyGroupSchema,
  updateStudySessionSchema
} from "./schemas";
import {
  automationService,
  buildStudyGroupCreatedPayload,
  buildStudySessionScheduledPayload
} from "../../services/automation";

export const groupsRouter = Router();

groupsRouter.get("/study-groups", async (request, response, next) => {
  try {
    const ownerProfileId = String(request.query.ownerProfileId ?? "").trim();
    if (!ownerProfileId) {
      throw new AppError(400, "ownerProfileId is required");
    }

    const groups = await listGroupsByOwner(ownerProfileId);
    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => ({
        group: {
          id: group.id,
          name: group.name,
          subject: group.subject,
          branch: group.branch,
          year: group.year,
          description: group.description,
          createdAt: group.created_at,
          updatedAt: group.updated_at
        },
        members: (await listGroupMembers(group.id)).map((member) => ({
          id: member.id,
          groupId: member.group_id,
          profileId: member.profile_id,
          role: member.role,
          createdAt: member.created_at
        }))
      }))
    );

    return response.status(200).json({ groups: groupsWithMembers });
  } catch (error) {
    return next(error);
  }
});

groupsRouter.post("/study-groups", async (request, response, next) => {
  try {
    const body = createStudyGroupSchema.parse(request.body);
    const group = await createGroup({
      owner_id: body.ownerProfileId,
      name: body.name,
      subject: body.subject,
      branch: body.branch,
      year: body.year,
      description: body.description ?? ""
    });

    await addGroupMember(group.id, body.ownerProfileId, "owner");

    if (body.memberIds?.length) {
      for (const memberId of body.memberIds) {
        if (memberId !== body.ownerProfileId) {
          await addGroupMember(group.id, memberId, "member");
        }
      }
    }

    await automationService.queue(
      "STUDY_GROUP_CREATED",
      "groups",
      group.id,
      buildStudyGroupCreatedPayload({
        title: group.name,
        groupName: group.name,
        subject: group.subject,
        branch: group.branch,
        year: group.year,
        occurredAt: new Date().toISOString(),
        addToCalendar: false
      })
    );

    const members = await listGroupMembers(group.id);
    return response.status(201).json({
      group: {
        group: {
          id: group.id,
          name: group.name,
          subject: group.subject,
          branch: group.branch,
          year: group.year,
          description: group.description,
          createdAt: group.created_at,
          updatedAt: group.updated_at
        },
        members: members.map((member) => ({
          id: member.id,
          groupId: member.group_id,
          profileId: member.profile_id,
          role: member.role,
          createdAt: member.created_at
        }))
      }
    });
  } catch (error) {
    return next(error);
  }
});

groupsRouter.put("/study-groups/:groupId", async (request, response, next) => {
  try {
    const groupId = request.params.groupId;
    const body = updateStudyGroupSchema.parse(request.body);

    const updated = await updateGroup(groupId, {
      name: body.name,
      subject: body.subject,
      branch: body.branch,
      year: body.year,
      description: body.description
    });

    await automationService.queue(
      "STUDY_GROUP_CREATED",
      "groups",
      updated.id,
      buildStudyGroupCreatedPayload({
        title: updated.name,
        groupName: updated.name,
        subject: updated.subject,
        branch: updated.branch,
        year: updated.year,
        occurredAt: new Date().toISOString(),
        addToCalendar: false
      })
    );

    return response.status(200).json({ group: updated });
  } catch (error) {
    return next(error);
  }
});

groupsRouter.delete("/study-groups/:groupId", async (request, response, next) => {
  try {
    await deleteGroup(request.params.groupId);
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

groupsRouter.get("/study-groups/:groupId/members", async (request, response, next) => {
  try {
    const members = await listGroupMembers(request.params.groupId);
    return response.status(200).json({
      members: members.map((member) => ({
        id: member.id,
        groupId: member.group_id,
        profileId: member.profile_id,
        role: member.role,
        createdAt: member.created_at
      }))
    });
  } catch (error) {
    return next(error);
  }
});

groupsRouter.post("/study-groups/:groupId/members", async (request, response, next) => {
  try {
    const payload = addStudyGroupMemberSchema.parse(request.body);
    const member = await addGroupMember(request.params.groupId, payload.profileId, payload.role);
    return response.status(201).json({
      member: {
        id: member.id,
        groupId: member.group_id,
        profileId: member.profile_id,
        role: member.role,
        createdAt: member.created_at
      }
    });
  } catch (error) {
    return next(error);
  }
});

groupsRouter.get("/study-sessions", async (request, response, next) => {
  try {
    const groupId = request.query.groupId ? String(request.query.groupId) : undefined;
    const sessions = await listSessions(groupId);
    return response.status(200).json({
      sessions: sessions.map((session) => ({
        id: session.id,
        groupId: session.group_id,
        topic: session.topic,
        agenda: session.agenda,
        scheduledAt: session.scheduled_at,
        durationMinutes: session.duration_minutes,
        availability: session.availability,
        addToCalendar: session.add_to_calendar,
        createdAt: session.created_at,
        updatedAt: session.updated_at
      }))
    });
  } catch (error) {
    return next(error);
  }
});

groupsRouter.post("/study-sessions", async (request, response, next) => {
  try {
    const body = createStudySessionSchema.parse(request.body);
    const session = await createSession({
      group_id: body.groupId,
      topic: body.topic,
      agenda: body.agenda,
      scheduled_at: body.scheduledAt,
      duration_minutes: body.durationMinutes,
      availability: body.availability,
      add_to_calendar: body.addToCalendar
    });

    await automationService.queue(
      "STUDY_SESSION_SCHEDULED",
      "groups",
      session.id,
      buildStudySessionScheduledPayload({
        title: session.topic,
        groupName: body.groupId,
        topic: session.topic,
        agenda: session.agenda,
        availability: session.availability,
        durationMinutes: session.duration_minutes,
        scheduleAt: session.scheduled_at,
        occurredAt: new Date().toISOString(),
        addToCalendar: session.add_to_calendar
      })
    );

    return response.status(201).json({
      session: {
        id: session.id,
        groupId: session.group_id,
        topic: session.topic,
        agenda: session.agenda,
        scheduledAt: session.scheduled_at,
        durationMinutes: session.duration_minutes,
        availability: session.availability,
        addToCalendar: session.add_to_calendar,
        createdAt: session.created_at,
        updatedAt: session.updated_at
      }
    });
  } catch (error) {
    return next(error);
  }
});

groupsRouter.put("/study-sessions/:sessionId", async (request, response, next) => {
  try {
    const payload = updateStudySessionSchema.parse(request.body);
    const updated = await updateSession(request.params.sessionId, {
      group_id: payload.groupId,
      topic: payload.topic,
      agenda: payload.agenda,
      scheduled_at: payload.scheduledAt,
      duration_minutes: payload.durationMinutes,
      availability: payload.availability,
      add_to_calendar: payload.addToCalendar
    });

    await automationService.queue(
      "STUDY_SESSION_SCHEDULED",
      "groups",
      updated.id,
      buildStudySessionScheduledPayload({
        title: updated.topic,
        groupName: updated.group_id,
        topic: updated.topic,
        agenda: updated.agenda,
        availability: updated.availability,
        durationMinutes: updated.duration_minutes,
        scheduleAt: updated.scheduled_at,
        occurredAt: new Date().toISOString(),
        addToCalendar: updated.add_to_calendar
      })
    );

    return response.status(200).json({ session: updated });
  } catch (error) {
    return next(error);
  }
});

groupsRouter.delete("/study-sessions/:sessionId", async (request, response, next) => {
  try {
    await deleteSession(request.params.sessionId);
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});