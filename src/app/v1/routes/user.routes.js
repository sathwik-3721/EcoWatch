import express from 'express';
const router = express.Router();
import { createUser, loginUser } from '../controllers/user.controller.js';

// Route for user registration
router.post('/register', createUser);

// Route for user login
router.post('/login', loginUser);

export default router;
