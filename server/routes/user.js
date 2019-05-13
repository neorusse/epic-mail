import express from 'express';
import UserController from '../controllers/UserController';
import { sanitizeBody } from 'express-validator/filter';

const router = express.Router();

// User Routes

// Register a user
router.post(
  '/signup',
  [
    sanitizeBody('firstName')
      .trim()
      .escape(),
    sanitizeBody('lastName')
      .trim()
      .escape(),
    sanitizeBody('email')
      .normalizeEmail()
      .trim()
      .escape()
  ],
  UserController.createUser
);

// User Sign in
router.post('/login', UserController.userSignin);

// User reset password
// router.post('/reset', user.passReset);

export default router;
