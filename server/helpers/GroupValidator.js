import Joi from 'joi';

class GroupValidator {

  /**
   * Validate group name
   */
  static validateGroupName(data) {
    const schema = Joi.object().keys({
      name: Joi.string().required().error(new Error('Please enter group name')),
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

export default GroupValidator;
