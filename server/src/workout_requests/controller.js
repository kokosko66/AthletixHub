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

export const getWorkoutRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(queries.getWorkoutRequests);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWorkoutRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(queries.getWorkoutRequestById, [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Workout request not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWorkoutRequestsByTrainerId = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const [rows] = await pool.query(queries.getWorkoutRequestsByTrainerId, [
      trainerId,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendingWorkoutRequestsByTrainerId = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const [rows] = await pool.query(
      queries.getPendingWorkoutRequestsByTrainerId,
      [trainerId],
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWorkoutRequestsByTraineeId = async (req, res) => {
  try {
    const { traineeId } = req.params;
    const [rows] = await pool.query(queries.getWorkoutRequestsByTraineeId, [
      traineeId,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addWorkoutRequest = async (req, res) => {
  try {
    const { traineeId, trainerId, status, created_at } = req.body;

    // Check if there's already a pending request from this trainee to this trainer
    const [existingRequests] = await pool.query(
      'SELECT * FROM WorkoutRequests WHERE trainee_id = ? AND trainer_id = ? AND status = "pending"',
      [traineeId, trainerId],
    );

    if (existingRequests.length > 0) {
      return res
        .status(409)
        .json({
          message: "You already have a pending request with this trainer",
        });
    }

    await pool.query(queries.addWorkoutRequest, [
      traineeId,
      trainerId,
      status || "pending",
      created_at || new Date().toISOString().slice(0, 19).replace("T", " "),
    ]);

    res.status(201).json({ message: "Workout request sent successfully" });
  } catch (error) {
    console.error("Error adding workout request:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateWorkoutRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");

    const [result] = await pool.query(queries.updateWorkoutRequestStatus, [
      status,
      updated_at,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Workout request not found" });
    }

    res.json({ message: `Workout request ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWorkoutRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(queries.deleteWorkoutRequest, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Workout request not found" });
    }

    res.json({ message: "Workout request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
