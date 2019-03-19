import jwt from 'jsonwebtoken';
import db from '../models/dbQuery';
import dotenv from 'dotenv';

dotenv.config();

class CheckAuth {
  /**
    Verify Token
    and do the next thing
  */
  static async verifyToken(req, res, next) {
    // check Authorization header for token
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).send({ auth: false, message: 'No token provided' });
    }
    try {
      // verifies token using secret
      const decodedToken = await jwt.verify(token, process.env.JWT_KEY);

      const retrieveId = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(retrieveId, [decodedToken.userId]);
      if (!rows[0]) {
        return res.status(400).send({ auth: false, message: 'Failed to authenticate token' });
      }
      // if everything is good, save to request for use in other routes
      req.user = {
        id: decodedToken.userId,
      };
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

export default CheckAuth;
