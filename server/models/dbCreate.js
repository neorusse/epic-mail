import { Pool } from 'pg';
import dbTableSchema from './dbSchema';
import dbConfig from './dbConfig'

// Connect with database
const pool = new Pool(dbConfig);

// Table Creation
const createTables = () => {
  pool.connect()
    .then((client) => {
      client.query(dbTableSchema)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          client.release();
          console.log(err)
        });
    });
}

// DB Query Method
module.exports = {
  createTables
};

// Expose exported function to the command line
require('make-runnable');


