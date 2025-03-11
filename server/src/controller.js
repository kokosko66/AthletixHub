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
        console.log("Received login request for email:", email);

        const userResult = await pool.query(queries.getUserByEmail, [email]);

        const users = userResult[0]; 

        if (!users || users.length === 0) {
            console.error("No user found with the given email");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = users[0];
        console.log("User found:", user);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Logged in successfully", user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const conroller = {
    login,
};

export { conroller };

