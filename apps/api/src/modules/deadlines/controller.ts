import type { Request, Response, NextFunction } from "express";
import { taskUpsertSchema } from "@campusflow/shared";
import { deadlineService } from "./service";
import { AppError } from "../../core/errors";
import { created, ok } from "../../core/response";

export class DeadlineController {
  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = request.user?.id;
      if (!profileId) {
        throw new AppError(401, "Unauthorized");
      }

      const body = taskUpsertSchema.parse(request.body);
      const task = await deadlineService.createTask(profileId, body);

      return created(response, task);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = request.user?.id;
      if (!profileId) {
        throw new AppError(401, "Unauthorized");
      }

      const taskId = request.params.id;
      if (!taskId) {
        throw new AppError(400, "Task ID is required");
      }

      const body = taskUpsertSchema.parse(request.body);
      const task = await deadlineService.updateTask(profileId, taskId, body);

      return ok(response, task);
    } catch (error) {
      next(error);
    }
  }

  async get(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = request.user?.id;
      if (!profileId) {
        throw new AppError(401, "Unauthorized");
      }

      const taskId = request.params.id;
      if (!taskId) {
        throw new AppError(400, "Task ID is required");
      }

      const task = await deadlineService.getTask(profileId, taskId);
      return ok(response, task);
    } catch (error) {
      next(error);
    }
  }

  async list(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = request.user?.id;
      if (!profileId) {
        throw new AppError(401, "Unauthorized");
      }

      const subject = (request.query.subject as string) || undefined;
      const completed = request.query.completed ? request.query.completed === "true" : undefined;

      const tasks = await deadlineService.listTasks(profileId, { subject, completed });
      return ok(response, { tasks });
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = request.user?.id;
      if (!profileId) {
        throw new AppError(401, "Unauthorized");
      }

      const taskId = request.params.id;
      if (!taskId) {
        throw new AppError(400, "Task ID is required");
      }

      await deadlineService.deleteTask(profileId, taskId);
      return ok(response, { ok: true });
    } catch (error) {
      next(error);
    }
  }

  async complete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = request.user?.id;
      if (!profileId) {
        throw new AppError(401, "Unauthorized");
      }

      const taskId = request.params.id;
      if (!taskId) {
        throw new AppError(400, "Task ID is required");
      }

      const task = await deadlineService.completeTask(profileId, taskId);
      return ok(response, task);
    } catch (error) {
      next(error);
    }
  }

  async stats(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = request.user?.id;
      if (!profileId) {
        throw new AppError(401, "Unauthorized");
      }

      const stats = await deadlineService.getDeadlineStats(profileId);
      return ok(response, stats);
    } catch (error) {
      next(error);
    }
  }
}

export const deadlineController = new DeadlineController();
