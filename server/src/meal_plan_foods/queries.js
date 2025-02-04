// meal_plan_id INT,
// food_id INT,
// PRIMARY KEY (meal_plan_id, food_id),
// FOREIGN KEY (meal_plan_id) REFERENCES MealPlans(id) ON DELETE CASCADE,
// FOREIGN KEY (food_id) REFERENCES Foods(id) ON DELETE CASCADE

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