import db from '../models/dbQuery';

const Group = {
  /**
   * create user group
   * @param {object} req
   * @param {object} res
   * @returns {object} group
   */
  async createGroup(req, res) {
    if (!req.body.group_name || !req.body.created_by) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    try {
      const createQuery = `INSERT INTO groups (group_name, created_by) VALUES ($1, $2) returning *`;

      const values = [
        req.body.group_name,
        req.user.id
      ];
      const { rows } = await db.query(createQuery, values);

      const membersQuery = `INSERT INTO group_members (user_id, group_id, role) VALUES ($1, $2, $3) returning *`
      const groupMembers = await db.query(membersQuery, [req.user.id, rows[0].group_id, 'admin' ]);

      return res.status(201).json({
        status: 201,
        message: 'Group Created successfully',
        data: {
          id: groupMembers.rows[0].id,
          name: rows[0].group_name,
          role: groupMembers.rows[0].role,
        }
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Get all groups
   * @param {object} req
   * @param {object} res
   * @returns {object} all created group
   */

  async allGroups(req, res) {

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
  },

  async updateGroup(req, res) {

    const updateQuery = `SELECT * FROM groups WHERE groups.id = $1 AND created_by = $2`;

    try {
      const { rows } = await db.query(updateQuery, [req.params.id, req.user.id]);

      if (rows.length === 0) {
        return res.status(400).json({
          status: 400,
          error: 'Group does not exist'
        });
      }
        const values = [req.body.group_name, req.params.id]
        const updateGroupQuery = `UPDATE groups SET group_name = $1 WHERE groups.Id = $2 RETURNING *`;

        const update = await db.query(updateGroupQuery, values);
        return res.status(200).json({
          status: 200,
          data: update.rows[0],
        });

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async deleteGroup(req, res) {

    const deleteQuery = `DELETE FROM groups WHERE groups.id = $1 AND created_by = $2 returning *`;

    try {
      const { rows } = await db.query(deleteQuery, [req.params.id, req.user.id]);

      if (rows.length === 0) {
        return res.status(400).json({
          status: 400,
          error: 'Group does not exist'
        });
      }

      if (rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'Group successfully deleted',
        });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },


  /**
   * Add user to a created group
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   */
  async addUser(req, res) {
    const { group_id } = req.params;

    try {
      const userQuery = `SELECT * FROM users WHERE email = $1`;
      const user = await db.query(userQuery, [req.body.email]);
      console.log(user)
      if(!user) {
        return res.status(404).json({
          status: 404,
          error: 'User does not exist'
        });
      }

      const addQuery = `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3) returning *`;
      const { rows } = await db.query(addQuery, [group_id, user.rows[0].id, req.body.role]);
      return res.status(201).json({
        status: 201,
        message: 'User added successfully',
        data: rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  /**
  * deletes a group member
  * @param {object} req
  * @param {object} res
  * @returns {object}
  */
  async deleteMember(req, res) {

    const { user_id, group_id } = req.params;

    try {
      // const Query = `SELECT * FROM group_members WHERE group_members.group_id = $1 AND  group_members.user_id = $2`;
      // const { rows } = await db.query(Query, [group_id, req.user.id]);

      const delQuery = `DELETE FROM group_members WHERE user_id = $1 AND group_id = $2 returning *`;
      await db.query(delQuery, [user_id, group_id]);

      return res.status(200).send({
        status: 200,
        message: 'User successfully deleted',
      });

      // if (rows[0] !== undefined) {

      // }
    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }

  },

  async sendGroupEmail(req, res) {
    const sender_id = req.user.id;
    const { group_id } = req.params;
    let { subject, message, parent_message_id } = req.body;

    try {

      const selectQuery = `SELECT * FROM group_members WHERE (group_id = $1 AND user_id = $2)`;
      const { rows } = await db.query(selectQuery, [group_id, sender_id]);

      // if (rows[0].length === 0) {
      //   return res.status(404).send({ message: 'member does not not exist' });
      // }

      const values = [
        subject,
        message,
        sender_id,
        group_id,
        parent_message_id,
        'sent'
      ];

      const sendQuery = `INSERT INTO message (subject, message, sender_id, group_id, parent_message_id, status) VALUES ($1, $2, $3, $4, $5, $6) returning *`;

      const sent = await db.query(sendQuery, values);

      return res.status(201).json({
        status: 201,
        data: sent.rows[0]
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }

  }

};

export default Group;
