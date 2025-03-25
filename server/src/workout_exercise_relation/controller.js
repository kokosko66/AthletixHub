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
        const { userId } = req.query;
        let query = queries.wholeWorkoutInfo;
        let params = [];
        
        if (userId) {
            query = `
                SELECT w.id AS workout_id, w.name AS workout_name, 
                       e.id AS exercise_id, e.name AS exercise_name, e.repetitions 
                FROM Workouts w 
                JOIN WorkoutExercises we ON w.id = we.workout_id 
                JOIN Exercises e ON we.exercise_id = e.id
                JOIN UserWorkouts uw ON w.id = uw.workout_id
                WHERE uw.user_id = ?
            `;
            params = [userId];
        }
        
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching workout info:", error);
        res.status(500).json({ error: error.message });
    }
}