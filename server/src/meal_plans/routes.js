import express from "express";

import {
  getMealPlans,
  getMealPlanById,
  getMealPlanByName,
  getMealPlanFoods,
  getMealPlansByUserId, // Add the new controller function
  addMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "./controller.js";

const router = express.Router();

router.get("/meal_plans", getMealPlans);
router.get("/meal_plans/user/:userId", getMealPlansByUserId); // Add this new route
router.get("/meal_plans/id/:id", getMealPlanById);
router.get("/meal_plans/name/:name", getMealPlanByName);
router.get("/meal_plans/id/:id/foods", getMealPlanFoods);
router.post("/meal_plans", addMealPlan);
router.put("/meal_plans/:id", updateMealPlan);
router.delete("/meal_plans/:id", deleteMealPlan);

export default router;
