import Messages from '../db/mockdb'

class Message {

  /**
   * Get all received emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all received emails
   */

  static allReceivedEmails(req, res) {
    if (!Messages) {
      return res.status(404).json({
        message: 'Messages not found in database',
      });
    }
    return res.status(200).json({
      success: 'true',
      message: 'All Emails retrieved successfully',
      Messages,
    });
  }

  /**
   * Get all unread emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all unread emails
   */

  static allUnreadEmails(req, res) {
    const unreadMessages = Messages.find(message => message.status === 'unread');
    if (unreadMessages) {
      return res.status(200).json({
        success: 'true',
        message: 'All unread emails retrieved',
        unreadMessages,
      });
    }
    return res.status(404).json({
      message: 'Not found in database',
    });
  }

  /**
   * Get all sent emails
   * @param {object} req
   * @param {object} res
   * @returns {object} List of all sent emails
   */

  static allSentEmails(req, res) {
    const sentMessages = Messages.find(message => message.status === 'sent');
    if (sentMessages) {
      return res.status(200).json({
        success: 'true',
        message: 'All sent emails retrieved',
        sentMessages,
      });
    }
    return res.status(404).json({
      message: 'Not found in database',
    });
  }

  /**
   * Get a specific sent email
   * @param {object} req
   * @param {object} res
   * @returns {object} one sent
   */
  static getAsentMail(req, res) {
    const id = parseInt(req.params.id, 10);

    Messages.map((message) => {
      if (message.id === id) {
        return res.status(200).json({
          success: 'true',
          message: 'Mail retrieved successfully',
          message,
        });
      }
    });
    return res.status(404).json({
      success: 'false',
      message: 'Mail does not exist',
    });
  }

  /**
  * Delete a mail
  * @param {object} req
  * @param {object} res
  * @returns {object} JSON response
  */
  static deleteMail(req, res) {

    const id = parseInt(req.params.id, 10);

    Messages.map((message, index) => {
      if (message.id === id) {
        Messages.splice(index, 1);
        return res.status(200).json({
          success: 'true',
          message: 'Email deleted successfully',
        });
      }
    });
    return res.status(404).json({
      success: 'false',
      message: 'Mail not found',
    });
  }

  /**
   * send an Email
   * @param {object} req
   * @param {object} res
   * @returns {object} created object
   */

  static sendEmail(req, res) {
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

    const mail = {
      id: Messages.length + 1,
      subject,
      message,
      createdOn: new Date(),
      parentMessageId: 1,
      status: 'sent',
    };

    Messages.push(mail);
    return res.status(201).json({
      success: 'true',
      message: 'Mail sent successfully',
      mail
    });
  }
}

export default Message;
