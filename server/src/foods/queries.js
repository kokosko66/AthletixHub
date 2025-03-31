const getFoods = "SELECT * FROM Foods";
const getFoodById = "SELECT * FROM Foods WHERE id = ?";
const getFoodByName = "SELECT * FROM Foods WHERE name = ?";

const addFoods = "INSERT INTO Foods (name, calories) VALUES (?, ?)";
const updateFoods = "UPDATE Foods SET name = ?, calories = ?";
const deleteFoods = "DELETE FROM Foods WHERE id = ?";

export const queries = {
  getFoods,
  getFoodById,
  getFoodByName,
  addFoods,
  updateFoods,
  deleteFoods,
};
