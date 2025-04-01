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

export const getCompletedWorkouts = async (req, res) => {
  try {
    const [rows] = await pool.query(queries.getCompletedWorkouts);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompletedWorkoutsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(queries.getCompletedWorkoutsByUserId, [
      userId,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompletedWorkoutsByDate = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const [rows] = await pool.query(queries.getCompletedWorkoutsByDate, [
      userId,
      date,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompletedWorkoutsByDateRange = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const [rows] = await pool.query(queries.getCompletedWorkoutsByDateRange, [
      userId,
      startDate,
      endDate,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addCompletedWorkout = async (req, res) => {
  try {
    const { userId, workoutId, completedDate } = req.body;
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Check if this workout has already been marked as completed for this date
    const [existingEntries] = await pool.query(
      "SELECT * FROM CompletedWorkouts WHERE user_id = ? AND workout_id = ? AND completed_date = ?",
      [userId, workoutId, completedDate],
    );

    if (existingEntries.length > 0) {
      // If it exists, delete it (toggle functionality)
      await pool.query(queries.deleteCompletedWorkoutByDetails, [
        userId,
        workoutId,
        completedDate,
      ]);
      return res
        .status(200)
        .json({ message: "Workout completion removed", status: "removed" });
    }

    // Otherwise, add the completed workout
    await pool.query(queries.addCompletedWorkout, [
      userId,
      workoutId,
      completedDate,
      createdAt,
    ]);

    res
      .status(201)
      .json({ message: "Workout marked as completed", status: "added" });
  } catch (error) {
    console.error("Error marking workout completion:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCompletedWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(queries.deleteCompletedWorkout, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Completed workout not found" });
    }

    res.json({ message: "Completed workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
