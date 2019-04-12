import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

// User Routes

// Register a user
router.post('/signup', UserController.createUser);

// User Sign in
router.post('/login', UserController.userSignin);

// User reset password
// router.post('/reset', user.passReset);

export default router;
