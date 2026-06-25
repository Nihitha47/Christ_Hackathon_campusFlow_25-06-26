import { Router } from "express";
import { placementItemSchema, placementItemUpsertSchema } from "@campusflow/shared";
import { placementService } from "./placement-service";
import { AppError } from "../../core/errors";

export const placementRouter = Router();

placementRouter.get("/", async (request, response, next) => {
  try {
    const profileId = request.header("X-Profile-Id");
    if (!profileId) throw new AppError(401, "Missing profile id header");

    const { type, status } = request.query;
    const items = await placementService.list(profileId, {
      type: typeof type === "string" ? type : undefined,
      status: typeof status === "string" ? status : undefined
    });

    response.status(200).json({ data: items });
  } catch (error) {
    next(error);
  }
});

placementRouter.post("/", async (request, response, next) => {
  try {
    const profileId = request.header("X-Profile-Id");
    if (!profileId) throw new AppError(401, "Missing profile id header");

    const body = placementItemUpsertSchema.parse(request.body);
    const item = await placementService.create(profileId, body);

    response.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
});

placementRouter.put("/:id", async (request, response, next) => {
  try {
    const profileId = request.header("X-Profile-Id");
    if (!profileId) throw new AppError(401, "Missing profile id header");

    const { id } = request.params;
    const body = placementItemUpsertSchema.partial().parse(request.body);
    const item = await placementService.update(profileId, id, body);

    response.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
});

placementRouter.post("/:id/schedule", async (request, response, next) => {
  try {
    const profileId = request.header("X-Profile-Id");
    if (!profileId) throw new AppError(401, "Missing profile id header");

    const { id } = request.params;
    const scheduledAt = placementItemSchema.pick({ scheduledAt: true }).parse(request.body).scheduledAt;

    if (!scheduledAt) {
      throw new AppError(400, "scheduledAt is required");
    }

    const item = await placementService.scheduleMockInterview(profileId, id, scheduledAt);
    response.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
});

placementRouter.delete("/:id", async (request, response, next) => {
  try {
    const profileId = request.header("X-Profile-Id");
    if (!profileId) throw new AppError(401, "Missing profile id header");

    await placementService.delete(profileId, request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});
