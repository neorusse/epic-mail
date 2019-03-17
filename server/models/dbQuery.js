import { Pool } from 'pg';
import dbConfig from './dbConfig'

// Connect with database
const pool = new Pool(dbConfig);

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
