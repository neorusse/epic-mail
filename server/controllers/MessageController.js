import MessageModel from '../models/Messages'

class Message {

  /**
  * Create an Email
  * @param {object} req
  * @param {object} res
  * @returns {object} email object
  */
  static createMail(req, res) {
    const { subject, message, parentMessageId, status } = req.body;

    if (!subject && !message && !parentMessageId && !status) {
      return res.status(400).send({ 'message': 'All fields are required'});
    }

    const email = MessageModel.create(req.body);
    return res.status(201).send(email);
  }

  /**
  * Get all sent email
  * @param {object} req
  * @param {object} res
  * @returns {object} An Array of sent mails
  */
  static getAllSentMails(req, res) {
    const emails = MessageModel.getSentMail();
    return res.status(200).send(emails);
  }

  /**
  * Get one sent email
  * @param {object} req
  * @param {object} res
  * @returns {object} email object
  */
  static getASentMail(req, res) {
    const email = MessageModel.getOneSentMail(req.params.id);
    if(!email) {
      return res.status(404).send({ 'message': 'email not found' });
    }
    return res.status(200).send(email);
  }

  /**
  * Delete a sent email
  * @param {object} req
  * @param {object} res
  * @returns {void} return status code 204
  */
  static deleteASentMail(req, res) {
    const email = MessageModel.getOneSentMail(req.params.id);
    if (!email) {
      return res.status(404).send({ 'message': 'email not found' });
    }
    const deleteMail = MessageModel.deleteMail(req.params.id);
    return res.status(204).send(deleteMail);
  }
}

export default Message;
