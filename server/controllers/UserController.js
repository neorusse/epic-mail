import db from '../models/dbQuery';
import Validator from '../helpers/UserValidator';
import Authenticate from '../helpers/Authenticate';

class UserController {

  /**
  * Create a User
  * @param {object} req
  * @param {object} res
  * @returns {object} User object and token
  */
  static async createUser(req, res) {

    // Validate signup information entered by user
    const { error } = Validator.signupValidate(req.body);

    if (error) {
      // return errors
      return res.status(400).json({
        status: 400,
        error: error.message
      });
    }

    // Hash password
    const hashPassword = Authenticate.hashPassword(req.body.password);

    // db query statement
    const createQuery = `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) returning id, first_name, last_name, email`;

    // values for db query
    const values = [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      hashPassword
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      const token = Authenticate.generateToken(rows[0].id);
      return res.status(201).json({
        status: 201,
        message: 'User registration successful',
        token: token,
        r: rows[0]
      });
    } catch(error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(409).json({
          status: 409,
          error: 'User with that EMAIL already exist'
        });
      }
      return res.status(400).json(error.message);
    }
  }

  /**
  * User Login
  * @param {object} req
  * @param {object} res
  * @returns {object} User object and token
  */
  static async userSignin(req, res) {

    try {
      // check if user exists
      const retrieveEmail = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await db.query(retrieveEmail, [req.body.email]);

      if (!rows[0] || !Authenticate.comparePassword(rows[0].password, req.body.password)) {
        return res.status(404).json({
          status: 404,
          error: 'Invalid password or email'
        });
      }

      const token = Authenticate.generateToken(rows[0].id);
      return res.status(200).json({
        status: 200,
        message: 'Authentication Successful',
        token: token
      });
    } catch (error) {
      return res.status(500).json({
          status: 500,
          error: 'Internal Server error'
        });
    }
  }
}

export default UserController;
