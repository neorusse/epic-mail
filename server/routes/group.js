import express from 'express';
import GroupController from '../controllers/GroupController';
import CheckAuth from '../middleware/CheckAuth';

const router = express.Router();

// Group Routes

// Create a group
router.post('/', CheckAuth.verifyToken, GroupController.createGroup);

// Get all groups
router.get('/', CheckAuth.verifyToken, GroupController.allGroups);

// // Update a group
// // router.patch('/:id', CheckAuth.verifyToken, GroupController.updateGroup);

// // Delete a group
// // router.delete('/:id', CheckAuth.verifyToken, GroupController.deleteGroup);

// Add user to a group
router.post('/:id/users', CheckAuth.verifyToken, GroupController.addUser);

// // // delete a user from a group
// // router.delete('/:id/users/:id', GroupController.deleteEmail);

// // Send an email to a group
// // router.post('/:id/messages', CheckAuth.verifyToken, GroupController.sendGroupEmail);

module.exports = router;
