import express from 'express';
import MessageController from '../controllers/MessageController';
import CheckAuth from '../middleware/CheckAuth';

const router = express.Router();

// Message Routes

// Create a mail
router.post('/', CheckAuth.verifyToken, MessageController.sendEmail);

// Get all received emails
router.get('/', CheckAuth.verifyToken, MessageController.allReceivedEmails);

// Get all unread mails
router.get('/unread', CheckAuth.verifyToken, MessageController.allUnreadEmails);

// Get all sent mails
router.get('/sent', CheckAuth.verifyToken, MessageController.allSentEmails);

// Get a single sent mail
router.get('/:id', CheckAuth.verifyToken,  MessageController.getASentMail);

// delete a product
router.delete('/:id', CheckAuth.verifyToken, MessageController.deleteEmail);

module.exports = router;
