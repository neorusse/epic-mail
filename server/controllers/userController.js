import usersDb from '../db/users'
import Helper from '../helpers/Helper'

class User {

  /**
  * Create a User
  * @param {object} req
  * @param {object} res
  * @returns {object} User object and token
  */
  static createUser(req, res) {

    // Validate information entered by user
    const dataValidator = Helper.infoValidator(req.body);
    if (dataValidator.error) {
      return Helper.dataMsgValidator(res, dataValidator.error);
    }

    const newUser = {
      id: usersDb.length + 1,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      mobileNumber: req.body.mobileNumber
    };

    // Hash password
    const hashPassword = Helper.hashPassword(newUser.password);
    newUser.password = hashPassword;

    // Push new user to database
    usersDb.push(newUser);

    // Generate token
    const token = Helper.generateToken(newUser.email);

    return res.status(201).json({
      message: `Authentication Successful, ${newUser.email} for new user: ${newUser.firstName} successfully created`,
      token: token
    });
  }

  /**
  * User Login
  * @param {object} req
  * @param {object} res
  * @returns {object} User object and token
  */
  static userSignin(req, res) {
    const emailObject = { email: req.body.email };
    const emailValidator = Helper.emailValidator(emailObject);
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Some values are missing' });
    }
    if (emailValidator.error) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const token = Helper.generateToken(req.body.email);
      return res.status(200).json({
        message: 'Authenticated, user signin successful',
        token: token
    });
  }
}

export default User;
