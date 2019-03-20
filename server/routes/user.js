import express from 'express';
import user from '../controllers/UserController';

const router = express.Router();

// User Routes

// Register a user
router.post('/signup', user.createUser);

// User Sign in
router.post('/login', user.userSignin);

// User reset password
// router.post('/reset', user.passReset);

module.exports = router;
