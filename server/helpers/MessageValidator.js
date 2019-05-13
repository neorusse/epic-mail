import Joi from 'joi';

class MessageValidator {

  /**
   * Validate signup info
   */
  static validateMessage(data) {
    const schema = Joi.object().keys({
      subject: Joi.string().required().error(new Error('Please enter message subject')),
      message: Joi.string().required().error(new Error('Please enter your message')),
      email: Joi.string().email().required().error(new Error('Please enter your recipient email')),
      status: Joi.string()
    });

    return Joi.validate(data, schema);
  }

  /**
   * Validate Params
   */

  static validateParams(data) {
    const schema = Joi.object().keys({
      id: Joi.number().integer().required().error(new Error('Please enter a valid id')),
    });

    return Joi.validate(data, schema);
  }

}

export default MessageValidator;
