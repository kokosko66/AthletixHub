import express from 'express';

import {
    getMealPlanFoods,
    getMealPlanFoodById,
    getMealPlanFoodByName,
    addMealPlanFood,
    updateMealPlanFood,
    deleteMealPlanFood
} from './controller.js';

const router = express.Router();

router.get('/meal_plan_foods', getMealPlanFoods);
router.get('/meal_plan_foods/id/:id', getMealPlanFoodById);
router.get('/meal_plan_foods/name/:name', getMealPlanFoodByName);
router.post('/meal_plan_foods', addMealPlanFood);
router.put('/meal_plan_foods/:id', updateMealPlanFood);
router.delete('/meal_plan_foods/:id', deleteMealPlanFood);

export default router;