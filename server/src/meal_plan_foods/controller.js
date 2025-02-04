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

export const getMealPlanFoods = async (req, res) => {
    try {
        const [rows] = await pool.query(queries.getMealPlanFoods);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMealPlanFoodById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(queries.getMealPlanFoodById, [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Meal Plan Food not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMealPlanFoodByName = async (req, res) => {
    try {
        const { name } = req.params;
        const [rows] = await pool.query(queries.getMealPlanFoodByName, [name]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addMealPlanFood = async (req, res) => {
    try {
        const { name, calories } = req.body;
        await pool.query(queries.addMealPlanFood, [name, calories]);
        res.status(201).json({ message: 'Meal Plan Food added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateMealPlanFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, calories } = req.body;
        const [result] = await pool.query(queries.updateMealPlanFood, [name, calories, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Meal Plan Food not found' });
        res.json({ message: 'Meal Plan Food updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMealPlanFood = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(queries.deleteMealPlanFood, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Meal Plan Food not found' });
        res.json({ message: 'Meal Plan Food deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};