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
    const [rows] = await pool.query(queries.getMealPlanByName, [name]);
    res.json(rows);
  } catch (error) {
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

// Only update the addMealPlan function in meal_plans/controller.js

export const addMealPlan = async (req, res) => {
  try {
    const { name, created_at } = req.body;

    // Use the `insertId` from the query result to return the ID of the new meal plan
    const [result] = await pool.query(queries.addMealPlan, [name, created_at]);

    res.status(201).json({
      message: "Meal Plan added successfully",
      id: result.insertId, // Return the ID of the newly created meal plan
    });
  } catch (error) {
    console.error("Error adding meal plan:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const [result] = await pool.query(queries.updateMealPlan, [name, id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Meal Plan not found" });
    res.json({ message: "Meal Plan updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Simplified deleteMealPlan function with sequential deletes
export const deleteMealPlan = async (req, res) => {
  try {
    const { id } = req.params;

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
    const [result] = await pool.query("DELETE FROM MealPlans WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Meal Plan not found" });
    }

    res.json({ message: "Meal Plan deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMealPlan:", error);
    res.status(500).json({ error: error.message });
  }
};
