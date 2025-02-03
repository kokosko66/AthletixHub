import express from 'express';
import {
    getUsers,
    getUserById,
    getUserByName,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser
} from './controller.js';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/id/:id', getUserById);
router.get('/users/name/:name', getUserByName);
router.get('/users/email/:email', getUserByEmail);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
