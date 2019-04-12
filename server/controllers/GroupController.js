import db from '../models/dbQuery';

class GroupController {
  /**
   * create user group
   * @param {object} req
   * @param {object} res
   * @returns {object} group
   */
  static async createGroup(req, res) {
    if (!req.body.name) {
      return res.status(400).json({
        status: 400,
        error: 'All fields are required'
      });
    }

    try {
      const createQuery = `INSERT INTO groups (name, created_by) VALUES ($1, $2) returning *`;

      const values = [
        req.body.name,
        req.user.id
      ];
      const { rows } = await db.query(createQuery, values);

      const membersQuery = `INSERT INTO group_members (member_id, group_id, role) VALUES ($1, $2, $3) returning *`
      const groupMembers = await db.query(membersQuery, [req.user.id, rows[0].id, 'admin' ]);

      return res.status(201).json({
        status: 201,
        message: 'Group Created successfully',
        data: {
          id: groupMembers.rows[0].id,
          name: rows[0].name,
          role: groupMembers.rows[0].role,
        }
      });
    } catch (error) {
      return res.status(403).json({
        status: 403,
        error: error.message
      });
    }
  }

  /**
   * Get all groups
   * @param {object} req
   * @param {object} res
   * @returns {object} all created group
   */

  static async allGroups(req, res) {

    const getQuery = `SELECT * FROM groups WHERE created_by = $1`;

    try {
      const { rows, rowCount } = await db.query(getQuery, [req.user.id]);
      return res.status(200).json({
        status: 200,
        message: 'All created groups retrieved successfully',
        data: rows,
        count: rowCount
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update a specific group
   * @param {*} req
   * @param {*} res
   */

  static async updateGroup(req, res) {

    const id = parseInt(req.params.groupId);

    try {

      const updateQuery = `SELECT * FROM group_members WHERE (group_id, member_id, role) = ($1, $2, $3)`;
      const { rows } = await db.query(updateQuery, [id, req.user.id, 'admin']);

      // check if user is an admin
      if (!rows[0]) {
        return res.status(400).json({
          status: 400,
          error: 'Invalid Group ID Supplied/Only Admin can update Group',
        });
      }

      const values = [req.body.name, id]
      const updateGroupQuery = `UPDATE groups SET name = $1 WHERE id = $2 RETURNING *`;
      const updated = await db.query(updateGroupQuery, values);

      if(updated) {
        return res.status(200).json({
          status: 200,
          data: {
            id: updated.rows[0].id,
            name: updated.rows[0].name,
            role: rows[0].role
          }
        });
      }

    } catch(error) {
    return res.status(400).json({ error: error.message });
    }
  }

  /**
   * delete a specific  group
   * @param {*} req
   * @param {*} res
   */
  static async deleteGroup(req, res) {

    const id = parseInt(req.params.groupId);

      const selectQuery = `SELECT * FROM group_members WHERE (group_id, member_id, role) = ($1, $2, $3)`;
      const { rows } = await db.query(selectQuery, [id, req.user.id, 'admin']);

      // check if user is an admin
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Invalid Group ID Supplied/Only Admin can delete Group',
        });
      }

      const delQuery = 'DELETE FROM group_members WHERE group_id = $1';
      await db.query(delQuery, [id]);

    try {

      const deleteQuery = 'DELETE FROM groups WHERE id = $1';
      await db.query(deleteQuery, [id]);

      return res.status(200).json({
        status: 200,
        data: {
          message: 'group has been deleted',
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: error.message
      });
    }
  }


  /**
   * Add user to a created group
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   */
  static async addUserToGroup(req, res) {

    const id = parseInt(req.params.groupId);

    const selectQuery = 'SELECT * FROM group_members WHERE (group_id, member_id) = ($1, $2)';
    const { rows } = await db.query(selectQuery, [id, req.user.id]);

      // check if group exist
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Group does not exist',
        });
      }

    // check if user is an admin group member
    if (rows[0].role !== 'admin') {
        return res.status(403).json({
          status: 403,
          error: 'sorry, you can not add a user to this group',
        });
      }


      // Check if member to be added is a registered user
      const userQuery = `SELECT * FROM users WHERE email = $1`;
      const user = await db.query(userQuery, [req.body.email]);

      if(!user) {
        return res.status(404).json({
          status: 404,
          error: 'User does not exist in db'
        });
      }

      const userExistQuery = 'SELECT * FROM group_members WHERE (group_id, member_id) = ($1, $2)';
      const userExist = await db.query(userExistQuery, [id, user.rows[0].id]);

      // check if user is already a member of the group
      if (!userExist) {
        return res.status(409).json({
          status: 409,
          error: 'user already a group member',
        });
      }

    try {

      const addQuery = `INSERT INTO group_members (group_id, member_id, role) VALUES ($1, $2, $3) returning *`;
      const newMember = await db.query(addQuery, [id, user.rows[0].id, 'member']);
      return res.status(201).json({
        status: 201,
        message: 'User added successfully',
        data: newMember.rows[0]
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: error.message
      });
    }
  }

  /**
  * deletes a group member
  * @param {object} req
  * @param {object} res
  * @returns {object}
  */
  static async deleteUserFromGroup(req, res) {

    const id = parseInt(req.params.groupId);

      const selectQuery = 'SELECT * FROM group_members WHERE (group_id, member_id) = ($1, $2)';
      const { rows } = await db.query(selectQuery, [id, req.user.id]);

      // check if group exist
      if (!rows[0]) {
        return res.status(403).json({
          status: 403,
          error: 'Group does not exist',
        });
      }

      // check if user is an admin group member
      if (rows[0].role !== 'admin') {
        return res.status(403).json({
          status: 403,
          error: 'sorry, you can not delete a user from this group',
        });
      }

    try {

      const userExistQuery = 'SELECT * FROM group_members WHERE (group_id, member_id) = ($1, $2)';
      const userExist = await db.query(userExistQuery, [id, req.params.userId]);
      // check if user is member of the group
      if (!userExist) {
        return res.status(403).json({
          status: 403,
          error: 'user not a group member',
        });
      }



      // Deletes member from a group
      const delQuery = `DELETE FROM group_members WHERE (group_id, member_id) = ($1, $2) returning *`;
      await db.query(delQuery, [id, req.params.userId]);

      return res.status(200).json({
        status: 200,
        message: 'User successfully deleted from group',
      });

    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error'
      });
    }

  }

  /**
   * Send an email to a group
   * @param {*} req
   * @param {*} res
   */
  static async sendGroupEmail(req, res) {

    try {

      const senderId = req.user.id;
      const groupId = parseInt(req.params.groupId);
      const { subject, message, parentMessageId } = req.body;

      const selectQuery = `SELECT * FROM group_members WHERE (group_id, member_id) = ($1, $2)`;
      const groupMembers = await db.query(selectQuery, [groupId, senderId]);

      // check if message sender belongs to group
      if (!groupMembers) {
        return res.status(403).json({
          status: 403,
          error: 'sorry, you are not a member of this group',
        });
      }

      const values = [
        subject,
        message,
        parentMessageId,
        senderId,
        'sent'
      ];

      const sendQuery = `INSERT INTO message (subject, message, parent_message_id, sender_id, status) VALUES ($1, $2, $3, $4, $5) returning *`;

      const sent = await db.query(sendQuery, values);

      // Persist message to Inbox of group members
      const inboxQuery = `INSERT INTO inbox (group_members_id, message_id) VALUES ($1, $2) returning *`;
      const inboxEmail = [groupMembers.rows[0].id, sent.rows[0].id];

      await db.query(inboxQuery, inboxEmail);

      return res.status(201).json({
        status: 201,
        message: `Message successfully sent to all members of group ${groupMembers.rows[0].id}`,
        data: sent.rows[0]
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }
}

export default GroupController;
