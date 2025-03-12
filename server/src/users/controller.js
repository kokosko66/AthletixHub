import { queries } from './queries.js';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ATHLETIXHUB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(queries.getUsers);
        console.log(rows);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(queries.getUserById, [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const [rows] = await pool.query(queries.getUsersByRole, [role]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUserByName = async (req, res) => {
    try {
        const { name } = req.params;
        const [rows] = await pool.query(queries.getUserByName, [name]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const [rows] = await pool.query(queries.getUserByEmail, [email]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addUser = async (req, res) => {
    try {
        
        const { name, email, password, role, created_at, short_description, family_name } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await pool.query(queries.addUser, [name, email, hashedPassword, role, created_at, short_description, family_name]);
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, family_name } = req.body;
        const [result] = await pool.query(queries.updateUser, [name, email, password, role, family_name, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(queries.deleteUser, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
