// Add this to server/src/completed_workouts/routes.js

import express from "express";
import {
  getCompletedWorkouts,
  getCompletedWorkoutsByUserId,
  getCompletedWorkoutsByDate,
  getCompletedWorkoutsByDateRange,
  addCompletedWorkout,
  deleteCompletedWorkout,
  getScheduledWorkoutsByDateRange, // Add this import
} from "./controller.js";

const router = express.Router();

router.get("/completed_workouts", getCompletedWorkouts);
router.get("/completed_workouts/user/:userId", getCompletedWorkoutsByUserId);
router.get(
  "/completed_workouts/user/:userId/date/:date",
  getCompletedWorkoutsByDate,
);
router.get(
  "/completed_workouts/user/:userId/range",
  getCompletedWorkoutsByDateRange,
);
// Add this new route for scheduled workouts
router.get(
  "/completed_workouts/user/:userId/scheduled",
  getScheduledWorkoutsByDateRange,
);
router.post("/completed_workouts", addCompletedWorkout);
router.delete("/completed_workouts/:id", deleteCompletedWorkout);

export default router;
