import db from '../models/dbQuery';

const Message = {

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


  try {

    if (req.body.status === 'draft') {

      // values for db query
      const values = [
        req.body.subject,
        req.body.message,
        req.body.parent_message_id,
        req.user.id,
        req.body.status
      ];

      const draftQuery = `INSERT INTO message (subject, message, parent_message_id, sender_id, status) VALUES ($1, $2, $3, $4, $5) returning *`
      const { rows } = await db.query(draftQuery, values);
      return res.status(201).json({
        status: 201,
        data: rows
      });
    }

    const usersQuery = `SELECT * FROM users WHERE email = $1`;
    const recipient = await db.query(usersQuery, [req.body.email])

    if (!recipient.rows[0]) {
      return res.status(400).json({ error: 'User not a registered member'})
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

    // Persist message to Sent box
    const sentQuery = `INSERT INTO sent (sender_id, message_id) VALUES ($1, $2) returning *`;
    const sentEmail = [req.user.id, rows[0].id]
    await db.query(sentQuery, sentEmail);

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
  },

  /**
   * Get all received emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all received emails
   */

  async allReceivedEmails(req, res) {

    const receiveQuery = `SELECT * FROM message LEFT JOIN inbox ON message.id = inbox.message_id WHERE receiver_id = $1`;

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
  },

  /**
   * Get all unread emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all unread emails
   */

  async allUnreadEmails(req, res) {

    const unreadQuery = `SELECT * FROM message LEFT JOIN inbox ON message.id = inbox.message_id WHERE (inbox.receiver_id, message.status) = ($1, $2)`;

    try {
      const { rows } = await db.query(unreadQuery, [req.user.id, 'sent']);
      if (!rows[0]) {
        return res.status(404).json({ 'message': 'None found in database' });
      }
      return res.status(200).json({
        status: 200,
        message: 'Email retrieved successfully',
        data: rows[0],
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Get all sent emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all sent emails
   */

  async allSentEmails(req, res) {

    const sentQuery = `SELECT * FROM message LEFT JOIN sent ON message.id = sent.message_id WHERE sent.sender_id = $1`;

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
        status: 200,
        message: 'Email retrieved successfully',
        data: rows[0],
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  /**
  * Delete an Email
  * @param {object} req
  * @param {object} res
  * @returns {void} status code 204
  */
  async deleteEmail(req, res) {

    const id = parseInt(req.params.id);

    if (typeof id !== Number) {
      return res.status(404).json({ error: 'Email not found in database' });
    }

    try {
      // delete from sent box
      const deleteSentQuery = 'DELETE FROM sent WHERE (sender_id, message_id) = ($1, $2) returning *';
      const deleteSent = await db.query(deleteSentQuery, [req.user.id, id]);

      if (deleteSent.rows[0]) {
        // delete from inbox
        const deleteInbox = 'DELETE FROM inbox WHERE message_id = $1 returning *';
        await db.query(deleteInbox, [id]);
      }

      // delete from message table
      const deleteQuery = 'DELETE FROM message WHERE (sender_id, id) = ($1, $2) returning *';
      const deletedmessage = await db.query(deleteQuery, [req.user.id, id]);
      if (deletedmessage.rows[0]) {
        return res.status(204).json({
          success: 'true',
          'message': 'Email deleted successfully'
        });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default Message;
