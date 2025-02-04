import express from 'express';

import {
    getUserMealPlans,
    getUserMealPlanById,
    getUserMealPlanByName,
    addUserMealPlan,
    updateUserMealPlan,
    deleteUserMealPlan
} from './controller.js';

const router = express.Router();

router.get('/user_meal_plans', getUserMealPlans);
router.get('/user_meal_plans/id/:id', getUserMealPlanById);
router.get('/user_meal_plans/name/:name', getUserMealPlanByName);
router.post('/user_meal_plans', addUserMealPlan);
router.put('/user_meal_plans/:id', updateUserMealPlan);
router.delete('/user_meal_plans/:id', deleteUserMealPlan);

export default router;