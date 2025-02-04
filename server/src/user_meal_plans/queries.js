// user_id INT,
// meal_plan_id INT,
// PRIMARY KEY (user_id, meal_plan_id),
// FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
// FOREIGN KEY (meal_plan_id) REFERENCES MealPlans(id) ON DELETE CASCADE

const getUserMealPlans = 'SELECT * FROM UserMealPlans';
const getUserMealPlanById = 'SELECT * FROM UserMealPlans WHERE user_id = ? AND meal_plan_id = ?';

const addUserMealPlan = 'INSERT INTO UserMealPlans (user_id, meal_plan_id) VALUES (?, ?)';
const updateUserMealPlan = 'UPDATE UserMealPlans SET user_id = ?, meal_plan_id = ? WHERE user_id = ? AND meal_plan_id = ?';
const deleteUserMealPlan = 'DELETE FROM UserMealPlans WHERE user_id = ? AND meal_plan_id = ?';

export const queries = {
    getUserMealPlans,
    getUserMealPlanById,
    addUserMealPlan,
    updateUserMealPlan,
    deleteUserMealPlan,
};