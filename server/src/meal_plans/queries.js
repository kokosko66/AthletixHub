const getMealPlans = 'SELECT * FROM MealPlans';
const getMealPlanById = 'SELECT * FROM MealPlans WHERE id = ?';

const addMealPlan = 'INSERT INTO MealPlans (name, created_at) VALUES (?, ?)';
const updateMealPlan = 'UPDATE MealPlans SET name = ? WHERE id = ?';
const deleteMealPlan = 'DELETE FROM MealPlans WHERE id = ?';

export const queries = {
    getMealPlans,
    getMealPlanById,
    addMealPlan,
    updateMealPlan,
    deleteMealPlan,
};
