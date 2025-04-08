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

export const getCompletedMeals = async (req, res) => {
  try {
    const [rows] = await pool.query(queries.getCompletedMeals);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompletedMealsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(queries.getCompletedMealsByUserId, [
      userId,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompletedMealsByDate = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const [rows] = await pool.query(queries.getCompletedMealsByDate, [
      userId,
      date,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompletedMealsByDateRange = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const [rows] = await pool.query(queries.getCompletedMealsByDateRange, [
      userId,
      startDate,
      endDate,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addCompletedMeal = async (req, res) => {
  try {
    const { userId, mealPlanId, completedDate } = req.body;
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Check if this meal has already been marked as completed for this date
    const [existingEntries] = await pool.query(
      "SELECT * FROM CompletedMeals WHERE user_id = ? AND meal_plan_id = ? AND completed_date = ?",
      [userId, mealPlanId, completedDate],
    );

    if (existingEntries.length > 0) {
      // If it exists, delete it (toggle functionality)
      await pool.query(queries.deleteCompletedMealByDetails, [
        userId,
        mealPlanId,
        completedDate,
      ]);
      return res
        .status(200)
        .json({ message: "Meal completion removed", status: "removed" });
    }

    // Otherwise, add the completed meal
    await pool.query(queries.addCompletedMeal, [
      userId,
      mealPlanId,
      completedDate,
      createdAt,
    ]);

    res
      .status(201)
      .json({ message: "Meal marked as completed", status: "added" });
  } catch (error) {
    console.error("Error marking meal completion:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCompletedMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(queries.deleteCompletedMeal, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Completed meal not found" });
    }

    res.json({ message: "Completed meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
