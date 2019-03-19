import db from '../models/dbQuery';

const Message = {

  /**
   * Get all received emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all received emails
   */

  async allReceivedEmails(req, res) {

    const receiveQuery = `SELECT * FROM inbox WHERE receiver_id = $1`;

    try {
      const { rows, rowCount } = await db.query(receiveQuery, [req.user.id]);
      return res.status(200).json({
        success: 'true',
        message: 'All sent emails retrieved',
        data: rows,
        count: rowCount
      });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  },

  /**
   * Get all unread emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all unread emails
   */

  async allUnreadEmails(req, res) {
    const unreadEmails = [];

    Messages.forEach((email) => {
      if (email.status === 'unread') {
        unreadEmails.push(email);
      }
    });

    return res.status(200).json({
      success: 'true',
      message: 'Mail retrieved successfully',
      data: unreadEmails
    });
  },

  /**
   * Get all sent emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all sent emails
   */

  async allSentEmails(req, res) {

    const sentQuery = `SELECT * FROM message WHERE sender_id = $1`;

    try {
      const { rows, rowCount } = await db.query(sentQuery, [req.user.id]);
      return res.status(200).json({
        success: 'true',
        message: 'All sent emails retrieved',
        data: rows,
        count: rowCount
      });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  },

  /**
   * Get a specific sent email
   * @param {object} req
   * @param {object} res
   * @returns {object} one sent
   */
  async getASentMail(req, res) {

    const id = req.params.id;

    const sentQuery = `SELECT * FROM message WHERE id = $1 AND sender_id = $2`;

    try {
      const { rows } = await db.query(sentQuery, [id, req.user.id]);
      if (!rows[0]) {
        return res.status(404).json({ 'message': 'Email not found in database' });
      }
      return res.status(200).json({
        success: 'true',
        message: 'Email retrieved successfully',
        data: rows[0],
      });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  },

  /**
  * Delete an Email
  * @param {object} req
  * @param {object} res
  * @returns {void} status code 204
  */
  async deleteEmail(req, res) {

    const id = req.params.id;

    const deleteQuery = 'DELETE FROM message WHERE id = $1 AND sender_id = $2';
    try {
      const { rows } = await db.query(deleteQuery, [id, req.user.id]);
      // if (!rows[0]) {
      //   return res.status(404).json({ 'message': 'Email not found in database' });
      // }
      return res.status(204).json({
        success: 'true',
        'message': 'Email deleted successfully'
      });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  },

  /**
   * send an Email
   * @param {object} req
   * @param {object} res
   * @returns {object} created object
   */

  async sendEmail(req, res) {
    const { subject, message } = req.body;
    if (!subject) {
      return res.status(400).json({
        success: 'false',
        message: 'Subject is required',
      });
    }
    if (!message) {
      return res.status(400).json({
        success: 'false',
        message: 'Message is required',
      });
    }

    // db query statement
    const messageQuery = `INSERT INTO message (subject, message, sender_id, status) VALUES ($1, $2, $3, $4) returning *`;

    // values for db query
    const values = [
      req.body.subject,
      req.body.message,
      req.user.id,
      req.body.status
    ];

    try {
      const { rows } = await db.query(messageQuery, values);
      return res.status(201).json({
        message: 'Message sent successfully',
        data: rows[0]
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default Message;
