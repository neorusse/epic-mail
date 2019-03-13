import express from 'express';
import MessageController from '../controllers/MessageController';

const router = express.Router();

// Message Routes

// Create a mail
router.post('/', MessageController.sendEmail);

// Get all received emails
router.get('/', MessageController.allReceivedEmails);

// Get all unread mails
router.get('/unread', MessageController.allUnreadEmails);

// Get all sent mails
router.get('/sent', MessageController.allSentEmails);

// Get a single sent mail
router.get('/:id', MessageController.getASentMail);

// delete a product
router.delete('/:id', MessageController.deleteEmail);

module.exports = router;
