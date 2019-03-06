import uuid from 'uuid';
import moment from 'moment';

class Message {
  /**
   * class constructor
   * @param {object} mail
   */
  constructor() {
    this.sentMail = [];
    this.draftMail = [];
  }

  /**
   * @param {object} mail object
   */
  create(mail) {
    const newMail = {
      id: uuid.v4(),
      createdOn: moment(new Date()),
      subject: mail.subject,
      message: mail.message,
      parentMessageId: mail.parentMessageId,
      status: mail.status
    };

    if (mail.status === false) {
      this.draftMail.push(newMail)
      return {
        message: 'Saved to draft messages',
        newMail
      }
    };

    this.sentMail.push(newMail);
    return {
      message: 'Mail sent succesffully',
      newMail
    }
  }

  /**
   * @returns {object} returns all sent mails
  */
  getSentMail() {
    return this.sentMail;
  }

  /**
  * @param {uuid} id
  * @returns {object} sent object
  */
  getOneSentMail(id) {
    return this.sentMail.find(sent => sent.id === id);
  }

  /**
  * @param {uuid} id
  */
  deleteMail(id) {
    const sent = this.getOneSentMail(id);
    const index = this.sentMail.indexOf(sent);
    this.sentMail.splice(index, 1);
    return {};
  }
}

export default new Message();
