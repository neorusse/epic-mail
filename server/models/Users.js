import uuid from 'uuid';
import moment from 'moment';
import Helper from '../helpers/Helper'

class User {
  /**
  * class constructor
  * @param {object} user
  */
  constructor() {
    this.users = [];
  }

  /**
  * @param {object} user object
  */
  create(user) {
    const newUser = {
      id: uuid.v4(),
      first_name: user.first_name,
      last_name: user.last_name,
      user_id: `${user.user_id}@epicmail.com`,
      password: user.password,
      mobile_number: user.mobile_number,
      createdOn: moment(new Date()),
      modifiedOn: moment(new Date())
    };

    // Hash password
    const hashPassword = Helper.hashPassword(newUser.password);
    newUser.password = hashPassword;

    this.users.push(newUser);
    return {
      message: `${newUser.user_id} email for new user: ${newUser.first_name} successfully created`,
      newUser
    }
  }

  /**
  * @param {uuid} id
  * @returns {object} sent object
  */
  getAUser(id) {
    return this.users.find(user => user.user_id === `${user_id}@epicmail.com`);
  }

}

export default new User();
