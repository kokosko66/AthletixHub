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

export const getWholeWorkoutInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(queries.wholeWorkoutInfo, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}