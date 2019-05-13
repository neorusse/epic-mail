import express from 'express';
import GroupController from '../controllers/GroupController';
import CheckAuth from '../middleware/CheckAuth';
import { sanitizeBody } from 'express-validator/filter';

const router = express.Router();

// Group Routes

// Create a group
router.post(
  '/',
  [
    sanitizeBody('name')
      .trim()
      .escape()
  ],
  CheckAuth.verifyToken,
  GroupController.createGroup
);

// Get all groups
router.get('/', CheckAuth.verifyToken, GroupController.allGroups);

// Update a group
router.patch(
  '/:groupId',
  [
    sanitizeBody('name')
      .trim()
      .escape()
  ],
  CheckAuth.verifyToken,
  GroupController.updateGroup
);

// Delete a group
router.delete('/:groupId', CheckAuth.verifyToken, GroupController.deleteGroup);

// Add user to a group
router.post(
  '/:groupId/users',
  [
    sanitizeBody('subject')
      .trim()
      .escape()
  ],
  CheckAuth.verifyToken,
  GroupController.addUserToGroup
);

// delete a user from a group
router.delete(
  '/:groupId/users/:userId',
  CheckAuth.verifyToken,
  GroupController.deleteUserFromGroup
);

// Send an email to a group
router.post(
  '/:groupId/messages',
  CheckAuth.verifyToken,
  GroupController.sendGroupEmail
);

export default router;
