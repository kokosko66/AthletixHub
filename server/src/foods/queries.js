const getFoods = "SELECT * FROM Foods";
const getFoodById = "SELECT * FROM Foods WHERE id = ?";
const getFoodByName = "SELECT * FROM Foods WHERE name = ?";

// Fix: Rename these to singular form to match controller expectations
const addFood = "INSERT INTO Foods (name, calories) VALUES (?, ?)";
const updateFood = "UPDATE Foods SET name = ?, calories = ? WHERE id = ?";
const deleteFood = "DELETE FROM Foods WHERE id = ?";

export const queries = {
  getFoods,
  getFoodById,
  getFoodByName,
  addFood,
  updateFood,
  deleteFood,
};
