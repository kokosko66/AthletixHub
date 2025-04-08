// server/src/completed_meals/routes.js
import express from "express";
import {
  getCompletedMeals,
  getCompletedMealsByUserId,
  getCompletedMealsByDate,
  getCompletedMealsByDateRange,
  addCompletedMeal,
  deleteCompletedMeal,
} from "./controller.js";

const router = express.Router();

router.get("/completed_meals", getCompletedMeals);
router.get("/completed_meals/user/:userId", getCompletedMealsByUserId);
router.get("/completed_meals/user/:userId/date/:date", getCompletedMealsByDate);
router.get("/completed_meals/user/:userId/range", getCompletedMealsByDateRange);
router.post("/completed_meals", addCompletedMeal);
router.delete("/completed_meals/:id", deleteCompletedMeal);

export default router;
