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

export const getWorkoutExercises = async (req, res) => {
    try {
        const [rows] = await pool.query(queries.getWorkoutExercises);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWorkoutExerciseById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(queries.getWorkoutExerciseById, [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Workout Exercise not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWorkoutExerciseByName = async (req, res) => {
    try {
        const { name } = req.params;
        const [rows] = await pool.query(queries.getWorkoutExerciseByName, [name]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addWorkoutExercise = async (req, res) => {
    try {
        const { name, created_at } = req.body;
        await pool.query(queries.addWorkoutExercise, [name, created_at]);
        res.status(201).json({ message: 'Workout Exercise added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateWorkoutExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const [result] = await pool.query(queries.updateWorkoutExercise, [name, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Workout Exercise not found' });
        res.json({ message: 'Workout Exercise updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteWorkoutExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(queries.deleteWorkoutExercise, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Workout Exercise not found' });
        res.json({ message: 'Workout Exercise deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};