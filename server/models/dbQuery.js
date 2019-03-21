import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Connect with database
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

export default {
  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   */
  query(text, values) {
    return new Promise((resolve, reject) => {
      pool.query(text, values)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        })
    })
  }
}
