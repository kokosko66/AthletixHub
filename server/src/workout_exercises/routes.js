import express from 'express';

import {
    getWorkoutExercises,
    getWorkoutExerciseById,
    getWorkoutExerciseByName,
    addWorkoutExercise,
    updateWorkoutExercise,
    deleteWorkoutExercise
} from './controller.js';

const router = express.Router();

router.get('/workout_exercises', getWorkoutExercises);
router.get('/workout_exercises/id/:id', getWorkoutExerciseById);
router.get('/workout_exercises/name/:name', getWorkoutExerciseByName);
router.post('/workout_exercises', addWorkoutExercise);
router.put('/workout_exercises/:id', updateWorkoutExercise);
router.delete('/workout_exercises/:id', deleteWorkoutExercise);

export default router;