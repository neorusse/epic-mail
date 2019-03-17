import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

class Helper {
  /**
  * Hash Password Method
  * @param {string} password
  * @returns {string} returns hashed password
  */
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(7));
  }

  /**
  * Generate Token
  * @param {string} id
  * @returns {string} token
  */

  static generateToken(email) {
    const token = jwt.sign(
      {
        userEmail: email,
      },
      process.env.JWT_KEY,
      { expiresIn: '7h' }
    );
    return token;
  }

  /**
   * isValidInfo helper method
   */
  static infoValidator(data) {
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    return Joi.validate(data, schema);
  }

  /**
   * isValidEmail helper method
   */

  static emailValidator(data) {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
    });

    return Joi.validate(data, schema);
  }

  /**
   * Error Handler
   */

  static dataMsgValidator(res, error) {
    // send a 400 (Bad Request) error response if validation fails
    res.status(400).json({
      status: 'error',
      message: 'Please enter valid data in fields',
      error: error.details[0].message,
    });
  }
}

export default Helper;
