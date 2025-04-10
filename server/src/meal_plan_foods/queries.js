const getMealPlanFoods = "SELECT * FROM MealPlanFoods";
const getMealPlanFoodById =
  "SELECT * FROM MealPlanFoods WHERE meal_plan_id = ? AND food_id = ?";
const getMealPlanFoodsByMealPlanId =
  "SELECT * FROM MealPlanFoods WHERE meal_plan_id = ?";

const addMealPlanFood =
  "INSERT INTO MealPlanFoods (meal_plan_id, food_id) VALUES (?, ?)";

const addMealPlanFoodWithQuantity =
  "INSERT INTO MealPlanFoods (meal_plan_id, food_id, quantity) VALUES (?, ?, ?)";

const updateMealPlanFood =
  "UPDATE MealPlanFoods SET meal_plan_id = ?, food_id = ? WHERE meal_plan_id = ? AND food_id = ?";
const deleteMealPlanFood =
  "DELETE FROM MealPlanFoods WHERE meal_plan_id = ? AND food_id = ?";
const deleteAllMealPlanFoods =
  "DELETE FROM MealPlanFoods WHERE meal_plan_id = ?";

export const queries = {
  getMealPlanFoods,
  getMealPlanFoodById,
  getMealPlanFoodsByMealPlanId,
  addMealPlanFood,
  addMealPlanFoodWithQuantity,
  updateMealPlanFood,
  deleteMealPlanFood,
  deleteAllMealPlanFoods,
};
