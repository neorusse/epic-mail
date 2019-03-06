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
  * comparePassword
  * @param {string} hashPassword
  * @param {string} password
  * @returns {Boolean} return True or False
  */
  static comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  }

  /**
  * Generate Token
  * @param {string} id
  * @returns {string} token
  */

  static generateToken(id) {
    const token = jwt.sign(
      {
        userId: id,
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
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      user_id: Joi.string().required(),
      password: Joi.required(),
      mobile_number: Joi.string().regex(/^\d{3}\d{4}\d{4}$/).required(),
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
    // send a 417 (Expected Failed) error response if validation fails
    res.status(417).json({
      status: 'error',
      message: 'Please enter valid data in fields',
      error: error.details[0].message,
    });
  }
}

export default Helper;
