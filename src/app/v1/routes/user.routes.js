import express from 'express';
const router = express.Router();
import { createUser, getUserName, loginUser, updatePassword } from '../controllers/user.controller.js';

// Route for user registration
router.post('/register', createUser);

// Route for user login
router.post('/login', loginUser);

// Get username from email
router.get('/get-username', getUserName);

// Forget password endpoint
router.put('/forget-password', updatePassword);

export default router;
