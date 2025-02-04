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

export const getExercises = async (req, res) => {
    try {
        const [rows] = await pool.query(queries.getExercises);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getExerciseById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(queries.getExerciseById, [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Exercise not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getExerciseByName = async (req, res) => {
    try {
        const { name } = req.params;
        const [rows] = await pool.query(queries.getExerciseByName, [name]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addExercise = async (req, res) => {
    try {
        const { name, repetitions } = req.body;
        await pool.query(queries.addExercise, [name, repetitions]);
        res.status(201).json({ message: 'Exercise added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, repetitions } = req.body;
        const [result] = await pool.query(queries.updateExercise, [name, repetitions, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Exercise not found' });
        res.json({ message: 'Exercise updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(queries.deleteExercise, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Exercise not found' });
        res.json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

