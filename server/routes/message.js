import express from 'express';
import MessageController from '../controllers/MessageController';
import CheckAuth from '../middleware/CheckAuth';
import { sanitizeBody } from 'express-validator/filter';

const router = express.Router();

// Message Routes

// Create a mail
router.post(
  '/',
  [
    sanitizeBody('subject')
      .trim()
      .escape(),
    sanitizeBody('email')
      .normalizeEmail()
      .trim()
      .escape()
  ],
  CheckAuth.verifyToken,
  MessageController.sendEmail
);

// Get all received emails
router.get('/', CheckAuth.verifyToken, MessageController.allReceivedEmails);

// Get all unread mails
router.get('/unread', CheckAuth.verifyToken, MessageController.allUnreadEmails);

// Get all sent mails
router.get('/sent', CheckAuth.verifyToken, MessageController.allSentEmails);

// Get a single sent mail
router.get('/:id', CheckAuth.verifyToken, MessageController.getASpecificMail);

// delete a product
router.delete('/:id', CheckAuth.verifyToken, MessageController.deleteEmail);

export default router;
