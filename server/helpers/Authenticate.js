import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Authenticate {
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
}

export default Authenticate;
