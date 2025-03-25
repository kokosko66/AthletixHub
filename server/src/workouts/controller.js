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
        const { name, exercises, userId, created_at } = req.body;
        const currentDate = created_at || new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        const [workoutResult] = await pool.query(queries.addWorkout, [name, currentDate]);
        const workoutId = workoutResult.insertId;
        
        if (exercises && exercises.length > 0) {
            const exercisePromises = exercises.map(async (exercise) => {
                const [existingExercises] = await pool.query('SELECT id FROM Exercises WHERE name = ?', [exercise.name]);
                
                let exerciseId;
                if (existingExercises.length > 0) {
                    exerciseId = existingExercises[0].id;
                    await pool.query('UPDATE Exercises SET repetitions = ? WHERE id = ?', [exercise.repetitions, exerciseId]);
                } else {
                    const [exerciseResult] = await pool.query(
                        'INSERT INTO Exercises (name, repetitions) VALUES (?, ?)',
                        [exercise.name, exercise.repetitions]
                    );
                    exerciseId = exerciseResult.insertId;
                }
                
                await pool.query(
                    'INSERT INTO WorkoutExercises (workout_id, exercise_id) VALUES (?, ?)',
                    [workoutId, exerciseId]
                );
            });
            
            await Promise.all(exercisePromises);
        }
        
        if (userId) {
            await pool.query(
                'INSERT INTO UserWorkouts (user_id, workout_id) VALUES (?, ?)',
                [userId, workoutId]
            );
        }
        
        res.status(201).json({ 
            message: 'Workout added successfully',
            workoutId: workoutId
        });
    } catch (error) {
        console.error("Error adding workout:", error);
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
