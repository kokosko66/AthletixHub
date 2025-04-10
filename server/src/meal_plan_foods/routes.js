import express from "express";

import {
  getMealPlanFoods,
  getMealPlanFoodById,
  getMealPlanFoodByName,
  addMealPlanFood,
  updateMealPlanFood,
  deleteMealPlanFood,
  deleteAllForMealPlan,
} from "./controller.js";

const router = express.Router();

router.get("/meal_plan_foods", getMealPlanFoods);
router.get("/meal_plan_foods/id/:id", getMealPlanFoodById);
router.get("/meal_plan_foods/name/:name", getMealPlanFoodByName);
router.post("/meal_plan_foods", addMealPlanFood);
router.put("/meal_plan_foods/:id", updateMealPlanFood);
router.delete("/meal_plan_foods/id/:id", deleteMealPlanFood);
router.delete("/meal_plan_foods/meal/:mealPlanId", deleteAllForMealPlan);

export default router;
