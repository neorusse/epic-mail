import Joi from 'joi';
import { runInNewContext } from 'vm';

class Validator {

  /**
   * Validate signup info
   */
  static signupValidate(data) {
    const schema = Joi.object().keys({
      firstName: Joi.string().min(3).required().error(new Error('First name is a required and must be more than 2 leters')),
      lastName: Joi.string().min(3).required().error(new Error('Last name is a required and must be more than 2 leters')),
      email: Joi.string().email().trim().lowercase().required().error(new Error('Email is a required')),
      password: Joi.string().trim().min(6).alphanum().required().error(new Error('Please enter a minimum of 6 alphanumeric password')),
   });

    return Joi.validate(data, schema);
  }

  /**
   * Validate login info
   */

  static loginValidate(data) {
    const schema = Joi.object().keys({
      email: Joi.string().email().trim().lowercase().required().error(new Error('Please enter your email')),
      password: Joi.string().trim().min(6).alphanum().required().error(new Error('Please enter your password')),
    });

    return Joi.validate(data, schema);
  }

}

export default Validator;
