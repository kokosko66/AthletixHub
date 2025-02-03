import {queries}  from './users/queries.js';
import bcrypt from 'bcrypt';
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

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query(queries.getUserByEmail, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult.rows[0]; 

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Logged in successfully', user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function register(req, res) {
    const { name, email, phone, password, role, created_at } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(queries.addUser, [
            name,
            email,
            phone,
            hashedPassword,
            role,
            created_at,
        ]);

        const newUser = result.rows[0];
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        console.error('Error during registration:', error);

        if (error.code === '23505') {
            return res.status(400).json({ message: 'Email already exists' });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
}

const conroller = {
    login,
    register,
};

export { conroller };

