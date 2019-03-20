import db from '../models/dbQuery';
import Helper from '../helpers/Helper';

const User = {

  /**
  * Create a User
  * @param {object} req
  * @param {object} res
  * @returns {object} User object and token
  */
  async createUser(req, res) {

    // Validate information entered by user
    const dataValidator = Helper.infoValidator(req.body);
    if (dataValidator.error) {
      return Helper.dataMsgValidator(res, dataValidator.error);
    }

    // Hash password
    const hashPassword = Helper.hashPassword(req.body.password);

    // db query statement
    const createQuery = `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) returning id, first_name, last_name, email`;

    // values for db query
    const values = [
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      hashPassword,
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      const token = Helper.generateToken(rows[0].id);
      return res.status(201).json({
        message: 'User registration successful',
        token: token
      });
    } catch(error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).json({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).json(error.message);
    }
  },

  /**
  * User Login
  * @param {object} req
  * @param {object} res
  * @returns {object} User object and token
  */
  async userSignin(req, res) {

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Some values are missing' });
    }

    const emailObject = { email: req.body.email };
    const emailValidator = Helper.emailValidator(emailObject);

    if (emailValidator.error) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const retrieveEmail = 'SELECT * FROM users WHERE email = $1';

    try {
      const { rows } = await db.query(retrieveEmail, [req.body.email]);

      if (!rows[0]) {
        return res.status(400).json({ message: 'Authentication failed' });
      }

      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).json({ message: 'Authentication failed' });
      }

      const token = Helper.generateToken(rows[0].id);
      return res.status(201).json({
        message: 'Authentication Successful',
        token: token
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default User;
