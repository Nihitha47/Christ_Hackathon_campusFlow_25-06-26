import express from "express";
import { deadlineController } from "./controller";

const router = express.Router();

// POST /api/deadlines - Create a deadline
router.post("/", (request, response, next) => deadlineController.create(request, response, next));

// GET /api/deadlines - List deadlines with optional filters
router.get("/", (request, response, next) => deadlineController.list(request, response, next));

// GET /api/deadlines/stats - Get deadline statistics
router.get("/stats", (request, response, next) => deadlineController.stats(request, response, next));

// GET /api/deadlines/:id - Get a single deadline
router.get("/:id", (request, response, next) => deadlineController.get(request, response, next));

// PATCH /api/deadlines/:id - Update a deadline
router.patch("/:id", (request, response, next) => deadlineController.update(request, response, next));

// DELETE /api/deadlines/:id - Delete a deadline
router.delete("/:id", (request, response, next) => deadlineController.delete(request, response, next));

// POST /api/deadlines/:id/complete - Mark deadline as complete
router.post("/:id/complete", (request, response, next) => deadlineController.complete(request, response, next));

export default router;
