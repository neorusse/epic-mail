import db from '../models/dbQuery';

const Group = {
  /**
   * create user group
   * @param {object} req
   * @param {object} res
   * @returns {object} group
   */
  async createGroup(req, res) {
    if (!req.body.name || !req.body.role ) {
      return res.status(400).send({ message: 'All fields are required' });
    }
    const createQuery = `INSERT INTO groups (name, role, owner_id) VALUES ($1, $2, $3) returning *`;

    const values = [
      req.body.name,
      req.body.role,
      req.user.id
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      return res.status(201).json({
        success: true,
        message: 'Group Created successfully',
        data: rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error });
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
    const addQuery = `INSERT INTO user_group (group_name, role, user_id) VALUES ($1, $2, $3) returning *`;

    const values = [
      req.body.group_name,
      req.body.role,
      req.user.id
    ];

    try {
      const { rows } = await db.query(addQuery, values);
      return res.status(201).json({
        success: true,
        message: 'User added successfully',
        data: rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  },



  /**
   * send an email to a group
   * @param {object} req
   * @param {object} res
   * @returns {object} email
   */
  async sendGroupEmail(req, res) {
    if (!req.body.group_name || !req.body.subject || !req.body.message) {
      return res.status(400).send({ message: 'enter a required details' });
    }
    const sendQuery = `INSERT INTO group_message (group_name, subject, message, owner_id) VALUES ($1, $2, $3, $4) returning *`;

    const values = [
      req.body.group_name,
      req.body.subject,
      req.body.message,
      req.user.id,
    ];

    try {
      const { rows } = await db.query(sendQuery, values);
      return res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  },



};

export default Group;
