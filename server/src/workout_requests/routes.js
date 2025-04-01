import express from "express";
import {
  getWorkoutRequests,
  getWorkoutRequestById,
  getWorkoutRequestsByTrainerId,
  getWorkoutRequestsByTraineeId,
  getPendingWorkoutRequestsByTrainerId,
  addWorkoutRequest,
  updateWorkoutRequestStatus,
  deleteWorkoutRequest,
} from "./controller.js";

const router = express.Router();

router.get("/workout_requests", getWorkoutRequests);
router.get("/workout_requests/id/:id", getWorkoutRequestById);
router.get(
  "/workout_requests/trainer/:trainerId",
  getWorkoutRequestsByTrainerId,
);
router.get(
  "/workout_requests/trainee/:traineeId",
  getWorkoutRequestsByTraineeId,
);
router.get(
  "/workout_requests/trainer/:trainerId/pending",
  getPendingWorkoutRequestsByTrainerId,
);
router.post("/workout_requests", addWorkoutRequest);
router.put("/workout_requests/:id/status", updateWorkoutRequestStatus);
router.delete("/workout_requests/:id", deleteWorkoutRequest);

export default router;
