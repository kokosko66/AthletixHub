// server/src/completed_meals/queries.js

const getCompletedMeals = "SELECT * FROM CompletedMeals";
const getCompletedMealsByUserId = `
    SELECT cm.*, mp.name as meal_plan_name
    FROM CompletedMeals cm
    JOIN MealPlans mp ON cm.meal_plan_id = mp.id
    WHERE cm.user_id = ?
    ORDER BY cm.completed_date DESC
`;
const getCompletedMealsByDate = `
    SELECT cm.*, mp.name as meal_plan_name
    FROM CompletedMeals cm
    JOIN MealPlans mp ON cm.meal_plan_id = mp.id
    WHERE cm.user_id = ? AND cm.completed_date = ?
`;
const getCompletedMealsByDateRange = `
    SELECT cm.*, mp.name as meal_plan_name
    FROM CompletedMeals cm
    JOIN MealPlans mp ON cm.meal_plan_id = mp.id
    WHERE cm.user_id = ? AND cm.completed_date BETWEEN ? AND ?
    ORDER BY cm.completed_date
`;

const addCompletedMeal =
  "INSERT INTO CompletedMeals (user_id, meal_plan_id, completed_date, created_at) VALUES (?, ?, ?, ?)";
const deleteCompletedMeal = "DELETE FROM CompletedMeals WHERE id = ?";
const deleteCompletedMealByDetails =
  "DELETE FROM CompletedMeals WHERE user_id = ? AND meal_plan_id = ? AND completed_date = ?";

export const queries = {
  getCompletedMeals,
  getCompletedMealsByUserId,
  getCompletedMealsByDate,
  getCompletedMealsByDateRange,
  addCompletedMeal,
  deleteCompletedMeal,
  deleteCompletedMealByDetails,
};
