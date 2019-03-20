import express from 'express';
import MessageController from '../controllers/MessageController';
import CheckAuth from '../middleware/CheckAuth';

const router = express.Router();

// Message Routes

// Send an email - protected route, requires req.headers.authorization
router.post('/', CheckAuth.verifyToken, MessageController.sendEmail);

// Get all received emails
router.get('/', CheckAuth.verifyToken, MessageController.allReceivedEmails);

// Get all unread emails
router.get('/unread', CheckAuth.verifyToken, MessageController.allUnreadEmails);

// Get all sent emails
router.get('/sent', CheckAuth.verifyToken, MessageController.allSentEmails);

// Get a single sent email
router.get('/:id', CheckAuth.verifyToken, MessageController.getASentMail);

// delete an email
router.delete('/:id', CheckAuth.verifyToken, MessageController.deleteEmail);

module.exports = router;
