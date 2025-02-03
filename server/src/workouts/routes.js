import express from 'express';
import {
    getWorkouts,
    getWorkoutById,
    getWorkoutByName,
    addWorkout,
    updateWorkout,
    deleteWorkout
} from './controller.js';

const router = express.Router();

router.get('/workouts', getWorkouts);
router.get('/workouts/id/:id', getWorkoutById);
router.get('/workouts/name/:name', getWorkoutByName);
router.post('/workouts', addWorkout);
router.put('/workouts/:id', updateWorkout);
router.delete('/workouts/:id', deleteWorkout);

export default router;
