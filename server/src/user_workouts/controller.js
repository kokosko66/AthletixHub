import {queries}  from './queries.js';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ATHLETIXHUB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const getUserWorkouts = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "Missing userId" });
        }

        const result = await pool.query(
            'SELECT workout_id FROM UserWorkouts WHERE user_id = ?',
            [userId]
        );

        res.json(result);
    } catch (error) {
        console.error("Error fetching user workouts:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getUserWorkoutById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(queries.getUserWorkoutById, [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User Workout not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserWorkoutByName = async (req, res) => {
    try {
        const { name } = req.params;
        const [rows] = await pool.query(queries.getUserWorkoutByName, [name]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addUserWorkout = async (req, res) => {
    try {
        const { userId, workoutId } = req.body;

        const existingWorkout = await pool.query(
            'SELECT * FROM UserWorkouts WHERE user_id = ? AND workout_id = ?',
            [userId, workoutId]
        );

        if (existingWorkout.length > 0) {
            return res.status(200).json({ message: "Workout already selected" }); // ✅ Return 200 instead of 409
        }

        await pool.query(
            'INSERT INTO UserWorkouts (user_id, workout_id) VALUES (?, ?)',
            [userId, workoutId]
        );

        res.status(201).json({ message: "Workout added successfully" });
    } catch (error) {
        console.error("Error adding workout:", error);
        res.status(500).json({ error: error.message });
    }
};




export const updateUserWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const [result] = await pool.query(queries.updateUserWorkout, [name, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User Workout not found' });
        res.json({ message: 'User Workout updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUserWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(queries.deleteUserWorkout, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User Workout not found' });
        res.json({ message: 'User Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};