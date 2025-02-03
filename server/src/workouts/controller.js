import { queries } from './queries.js';
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

export const getWorkouts = async (req, res) => {
    try {
        const [rows] = await pool.query(queries.getWorkouts);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWorkoutById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(queries.getWorkoutById, [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Workout not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWorkoutByName = async (req, res) => {
    try {
        const { name } = req.params;
        const [rows] = await pool.query(queries.getWorkoutByName, [name]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addWorkout = async (req, res) => {
    try {
        const { name, created_at } = req.body;
        await pool.query(queries.addWorkout, [name, created_at]);
        res.status(201).json({ message: 'Workout added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const [result] = await pool.query(queries.updateWorkout, [name, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Workout not found' });
        res.json({ message: 'Workout updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(queries.deleteWorkout, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Workout not found' });
        res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
