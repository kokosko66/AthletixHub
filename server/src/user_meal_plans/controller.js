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

export const getUserMealPlans = async (req, res) => {
    try {
        const [rows] = await pool.query(queries.getUserMealPlans);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserMealPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(queries.getUserMealPlanById, [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User Meal Plan not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserMealPlanByName = async (req, res) => {
    try {
        const { name } = req.params;
        const [rows] = await pool.query(queries.getUserMealPlanByName, [name]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addUserMealPlan = async (req, res) => {
    try {
        const { name, created_at } = req.body;
        await pool.query(queries.addUserMealPlan, [name, created_at]);
        res.status(201).json({ message: 'User Meal Plan added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUserMealPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const [result] = await pool.query(queries.updateUserMealPlan, [name, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User Meal Plan not found' });
        res.json({ message: 'User Meal Plan updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUserMealPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(queries.deleteUserMealPlan, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User Meal Plan not found' });
        res.json({ message: 'User Meal Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};