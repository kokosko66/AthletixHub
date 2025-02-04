import express from 'express';

import {
    getFoods,
    getFoodById,
    getFoodByName,
    addFood,
    updateFood,
    deleteFood
} from './controller.js';

const router = express.Router();

router.get('/foods', getFoods);
router.get('/foods/id/:id', getFoodById);
router.get('/foods/name/:name', getFoodByName);
router.post('/foods', addFood);
router.put('/foods/:id', updateFood);
router.delete('/foods/:id', deleteFood);

export default router;