import express from 'express';
import {
    getWholeWorkoutInfo
} from './controller.js';

const router = express.Router();

router.get('/workout_exercise_relation/:id', getWholeWorkoutInfo);

export default router;