import db from '../models/dbQuery';

class MessageController {

  /**
   * send an Email
   * @param {object} req
   * @param {object} res
   * @returns {object} created object
   */

  static async sendEmail(req, res) {
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


  try {

    const usersQuery = `SELECT * FROM users WHERE email = $1`;
    const recipient = await db.query(usersQuery, [req.body.email])

    // check if receiver exist in database
    if (!recipient.rows[0]) {
      return res.status(404).json({
        status: 404,
        error: 'Recipient is not a registered member'
      })
    }

    const values = [
      req.body.subject,
      req.body.message,
      req.body.parent_message_id,
      req.user.id,
      'sent'
    ];

    const messageQuery = `INSERT INTO message (subject, message, parent_message_id, sender_id, status) VALUES ($1, $2, $3, $4, $5) returning *`;
    const { rows } = await db.query(messageQuery, values);

    // Persist message to Inbox
    const inboxQuery = `INSERT INTO inbox (receiver_id, message_id) VALUES ($1, $2) returning *`;
    const inboxEmail = [recipient.rows[0].id, rows[0].id];

    await db.query(inboxQuery, inboxEmail);

    return res.status(201).json({
      status: 201,
      data: rows[0]
    });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get all received emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all received emails
   */

  static async allReceivedEmails(req, res) {

    const receiveQuery = `SELECT message.id, message.subject, message.message, message.parent_message_id, message.sender_id, message.created_date, message.status FROM message LEFT JOIN inbox ON message.id = inbox.message_id WHERE inbox.receiver_id = $1`;

    try {
      const { rows, rowCount } = await db.query(receiveQuery, [req.user.id]);
      return res.status(200).json({
        status: 200,
        message: 'All received emails retrieved',
        data: rows,
        count: rowCount
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get all unread emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all unread emails
   */

  static async allUnreadEmails(req, res) {

    const unreadQuery = `SELECT message.id, message.subject, message.message, message.parent_message_id, message.sender_id, message.created_date, inbox.status FROM message LEFT JOIN inbox ON message.id = inbox.message_id WHERE inbox.receiver_id = $1`;

    try {
      const { rows } = await db.query(unreadQuery, [req.user.id]);
      if (!rows) {
        return res.status(404).json({ 'message': 'None found in database' });
      }
      return res.status(200).json({
        status: 200,
        message: 'Email retrieved successfully',
        data: rows,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get all sent emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all sent emails
   */

  static async allSentEmails(req, res) {

    const sentQuery = `SELECT * FROM message WHERE sender_id = $1`;

    try {
      const { rows, rowCount } = await db.query(sentQuery, [req.user.id]);
      return res.status(200).json({
        status: 200,
        message: 'All sent emails retrieved',
        data: rows,
        count: rowCount
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get a specific sent email
   * @param {object} req
   * @param {object} res
   * @returns {object} one sent
   */
  static async getASpecificMail(req, res) {

    // validate user input
    const { id } = req.params;

    const sentQuery = `SELECT message.id, message.subject, message.message, message.parent_message_id, message.sender_id, message.created_date, message.status, inbox.receiver_id FROM message LEFT JOIN inbox ON message.id = inbox.message_id WHERE message.id = $1`;

    try {
      const { rows } = await db.query(sentQuery, [id]);

      if (rows[0].receiver_id === req.user.id) {
        const queryStrings = 'UPDATE message SET status = $1 WHERE id = $2 returning *';
        const updatedMessage = await db.query(queryStrings, ['read', rows[0].id]);
        return res.status(200).json({
          status: 200,
          message: 'Email retrieved successfully',
          data: updatedMessage.rows[0],
        });
      }

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
  * Delete an Email
  * @param {object} req
  * @param {object} res
  * @returns {void} status code 204
  */
  static async deleteEmail(req, res) {
    // validate user input
    const { id } = req.params;

    try {

      // delete from inbox
      const deleteInbox = 'DELETE FROM inbox WHERE message_id = $1 returning *';
      await db.query(deleteInbox, [id]);

      // delete from message table
      const deleteQuery = 'DELETE FROM message WHERE (sender_id, id) = ($1, $2) returning *';
      const deletedmessage = await db.query(deleteQuery, [req.user.id, id]);
      if (deletedmessage.rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'Email deleted successfully'
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: error.message
      });
    }
  }
}

export default MessageController;
