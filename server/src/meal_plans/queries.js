const getMealPlans = "SELECT * FROM MealPlans";
const getMealPlanById = "SELECT * FROM MealPlans WHERE id = ?";
const getMealPlansByUserId = "SELECT * FROM MealPlans WHERE user_id = ?";

const addMealPlan =
  "INSERT INTO MealPlans (name, created_at, user_id) VALUES (?, ?, ?)";
const updateMealPlan =
  "UPDATE MealPlans SET name = ? WHERE id = ? AND user_id = ?";
const deleteMealPlan = "DELETE FROM MealPlans WHERE id = ?";

export const queries = {
  getMealPlans,
  getMealPlanById,
  getMealPlansByUserId,
  addMealPlan,
  updateMealPlan,
  deleteMealPlan,
};
