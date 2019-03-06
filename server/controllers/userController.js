import userModel from '../models/Users'
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

    const user = userModel.create(req.body);
    const token = Helper.generateToken(user.newUser.user_id);
    return res.status(201).send({
      message: 'Authentication Successful',
      user,
      token,
    });
  }

  /**
  * User Login
  * @param {object} req
  * @param {object} res
  * @returns {object} User object and token
  */
  static userLogin(req, res) {
    const emailObject = { email: req.body.email };
    const emailValidator = Helper.emailValidator(emailObject);
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Some values are missing' });
    }
    if (emailValidator.error) {
      return res.status(400).send({ message: 'Please enter a valid email address' });
    }

    // find userPassword from JS Data Structure
    const registeredUser = userModel.getAUser(req.body.user_id)
    console.log(registeredUser);

    // Compare usermail from JS Data Structure and
    if (!Helper.comparePassword(registeredUser.password, req.body.password)) {
      return res
        .status(400)
        .send({ message: 'Authentication failed' });
    }

    const token = Helper.generateToken(registeredUser.newUser.user_id);
      return res.status(201).send({
        message: 'Authentication Successful',
        token: token
    });
  }
}

export default User;
