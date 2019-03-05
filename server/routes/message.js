import express from 'express';
import message from '../controllers/MessageController';

const router = express.Router();

// Message Routes

// Create a mail
router.post('/', message.createMail);

// Get all sent mails
router.get('/', message.getAllSentMails);

// Get a single sent mail
router.get('/:id', message.getASentMail);

// delete a product
router.delete('/:id', message.deleteASentMail);

module.exports = router;
