import Joi from 'joi';

class UserValidator {
  /**
   * Validate signup info
   */
  static signupValidate(data) {
    const schema = Joi.object().keys({
      firstName: Joi.string()
        .min(3)
        .required()
        .error(
          new Error('First name is a required and must be more than 2 letters')
        ),
      lastName: Joi.string()
        .min(3)
        .required()
        .error(
          new Error('Last name is a required and must be more than 2 letters')
        ),
      email: Joi.string()
        .email()
        .required()
        .error(new Error('Email is not valid')),
      password: Joi.string()
        .min(6)
        .alphanum()
        .required()
        .error(new Error('Please enter a minimum of 6 alphanumeric password'))
    });

    return Joi.validate(data, schema);
  }
}

export default UserValidator;
