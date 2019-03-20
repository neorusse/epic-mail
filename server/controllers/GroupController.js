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

    try {
      const selectQuery = 'SELECT * FROM group_members WHERE (user_id, group_id) = ($1, $2)';
      const members = await db.query(selectQuery, [req.user.id, req.params.id]);

      if (members.rows[0].role === 'admin') {
        const updateQuery = 'UPDATE groups SET group_name = $1 WHERE (id) = ($2) returning *';
        const values = [req.body.group_name, req.params.id];
        const { rows } = await db.query(updateQuery, values);
        if (!rows[0]) {
          return res.status(404).json({
            status: 404,
            error: 'message can not be found',
          });
        }
        return res.status(200).json({
          status: 200,
          message: 'Group updated successfully',
          data: {
            id: rows[0].id,
            name: rows[0].group_name,
            role: members.rows[0].role,
          },
        });
      }

      return res.status(400).json({
        status: 400,
        error: 'you are not authorised for this operation',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  },


  /**
   * Add user to a created group
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   */
  async addUser(req, res) {
    if (!req.body.group_name || !req.body.role) {
      return res.status(400).send({ message: 'enter a group name' });
    }
    const addQuery = `INSERT INTO group_members (group_name, role, user_id) VALUES ($1, $2, $3) returning *`;

    const values = [
      req.body.group_name,
      req.body.role,
      req.user.id
    ];

    try {
      const { rows } = await db.query(addQuery, values);
      return res.status(201).json({
        status: 201,
        message: 'User added successfully',
        data: rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

};

export default Group;
