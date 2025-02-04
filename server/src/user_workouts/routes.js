import express from 'express';

import {
    getUserWorkouts,
    getUserWorkoutById,
    getUserWorkoutByName,
    addUserWorkout,
    updateUserWorkout,
    deleteUserWorkout
} from './controller.js';

const router = express.Router();

router.get('/user_workouts', getUserWorkouts);
router.get('/user_workouts/id/:id', getUserWorkoutById);
router.get('/user_workouts/name/:name', getUserWorkoutByName);
router.post('/user_workouts', addUserWorkout);
router.put('/user_workouts/:id', updateUserWorkout);
router.delete('/user_workouts/:id', deleteUserWorkout);

export default router;