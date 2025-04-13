import { queries } from "./queries.js";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "ATHLETIXHUB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const getMealPlans = async (req, res) => {
  try {
    const [rows] = await pool.query(queries.getMealPlans);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMealPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(queries.getMealPlanById, [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Meal Plan not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMealPlanByName = async (req, res) => {
  try {
    const { name } = req.params;
    const [rows] = await pool.query("SELECT * FROM MealPlans WHERE name = ?", [
      name,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get meal plans for a specific user
export const getMealPlansByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = "SELECT * FROM MealPlans WHERE user_id = ?";
    const [rows] = await pool.query(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching meal plans by user ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// New function to get foods associated with a meal plan
export const getMealPlanFoods = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT f.id, f.name, f.calories, mpf.quantity
      FROM Foods f
      JOIN MealPlanFoods mpf ON f.id = mpf.food_id
      WHERE mpf.meal_plan_id = ?
    `;

    const [rows] = await pool.query(query, [id]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching meal plan foods:", error);
    res.status(500).json({ error: error.message });
  }
};

// Modify existing addMealPlan function to include user_id
export const addMealPlan = async (req, res) => {
  try {
    const { name, created_at, user_id } = req.body;

    // Make sure user_id is provided
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Add the meal plan with user_id
    const [result] = await pool.query(
      "INSERT INTO MealPlans (name, created_at, user_id) VALUES (?, ?, ?)",
      [name, created_at, user_id],
    );

    res.status(201).json({
      message: "Meal Plan added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding meal plan:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, user_id } = req.body;

    // First check if the meal plan belongs to this user
    const [mealPlan] = await pool.query(
      "SELECT * FROM MealPlans WHERE id = ?",
      [id],
    );

    if (mealPlan.length === 0) {
      return res.status(404).json({ message: "Meal Plan not found" });
    }

    if (user_id && mealPlan[0].user_id !== parseInt(user_id)) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to update this meal plan",
        });
    }

    // Now update the meal plan
    const [result] = await pool.query(
      "UPDATE MealPlans SET name = ? WHERE id = ?",
      [name, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Meal Plan not found" });
    }

    res.json({ message: "Meal Plan updated successfully" });
  } catch (error) {
    console.error("Error updating meal plan:", error);
    res.status(500).json({ error: error.message });
  }
};

// Simplified deleteMealPlan function with sequential deletes
export const deleteMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    // First check if the meal plan belongs to this user
    if (user_id) {
      const [mealPlan] = await pool.query(
        "SELECT * FROM MealPlans WHERE id = ?",
        [id],
      );

      if (mealPlan.length > 0 && mealPlan[0].user_id !== parseInt(user_id)) {
        return res
          .status(403)
          .json({
            message: "You do not have permission to delete this meal plan",
          });
      }
    }

    // 1. First, delete related records from MealPlanFoods
    try {
      await pool.query("DELETE FROM MealPlanFoods WHERE meal_plan_id = ?", [
        id,
      ]);
      console.log("Deleted associated foods");
    } catch (error) {
      console.error("Error deleting associated foods:", error);
      // Continue anyway to try deleting the meal plan
    }

    // 2. Delete from CompletedMeals
    try {
      await pool.query("DELETE FROM CompletedMeals WHERE meal_plan_id = ?", [
        id,
      ]);
      console.log("Deleted completed meal records");
    } catch (error) {
      console.error("Error deleting completed meals:", error);
      // Continue anyway to try deleting the meal plan
    }

    // 3. Finally, delete the meal plan
    const deleteQuery = user_id
      ? "DELETE FROM MealPlans WHERE id = ? AND user_id = ?"
      : "DELETE FROM MealPlans WHERE id = ?";

    const params = user_id ? [id, user_id] : [id];
    const [result] = await pool.query(deleteQuery, params);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Meal Plan not found or you do not have permission" });
    }

    res.json({ message: "Meal Plan deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMealPlan:", error);
    res.status(500).json({ error: error.message });
  }
};
