import express from 'express';

import {
    getExercises,
    getExerciseById,
    getExerciseByName,
    addExercise,
    updateExercise,
    deleteExercise
} from './controller.js';

const router = express.Router();

router.get('/exercises', getExercises);
router.get('/exercises/id/:id', getExerciseById);
router.get('/exercises/name/:name', getExerciseByName);
router.post('/exercises', addExercise);
router.put('/exercises/:id', updateExercise);
router.delete('/exercises/:id', deleteExercise);

export default router;