import express from 'express';
import user from '../controllers/userController';

const router = express.Router();

// User Routes

// Register a user
router.post('/signup', user.createUser);

// User Sign in
router.post('/signin', user.userSignin);

module.exports = router;
