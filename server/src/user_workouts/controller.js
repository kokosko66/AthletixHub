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
        const [rows] = await pool.query(queries.getUserWorkouts);
        res.json(rows);
    } catch (error) {
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

        if (!userId || !workoutId) {
            return res.status(400).json({ error: "Missing userId or workoutId" });
        }

        await pool.query(queries.addUserWorkout, [userId, workoutId]);

        res.status(201).json({ message: 'User Workout added successfully' });
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