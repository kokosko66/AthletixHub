const getMealPlanFoods = 'SELECT * FROM MealPlanFoods';
const getMealPlanFoodById = 'SELECT * FROM MealPlanFoods WHERE meal_plan_id = ? AND food_id = ?';

const addMealPlanFood = 'INSERT INTO MealPlanFoods (meal_plan_id, food_id) VALUES (?, ?)';
const updateMealPlanFood = 'UPDATE MealPlanFoods SET meal_plan_id = ?, food_id = ? WHERE meal_plan_id = ? AND food_id = ?';
const deleteMealPlanFood = 'DELETE FROM MealPlanFoods WHERE meal_plan_id = ? AND food_id = ?';

export const queries = {
    getMealPlanFoods,
    getMealPlanFoodById,
    addMealPlanFood,
    updateMealPlanFood,
    deleteMealPlanFood,
};