/**
 * Table creation Query
 */

const users = `DROP TABLE IF EXISTS users; CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   first_name VARCHAR(20) NOT NULL,
   last_name VARCHAR(20) NOT NULL,
   email VARCHAR(50) UNIQUE NOT NULL,
   password VARCHAR(150) NOT NULL,
   role VARCHAR(20) NOT NULL DEFAULT('user'),
   created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const groups = `DROP TABLE IF EXISTS groups; CREATE TABLE IF NOT EXISTS groups (
   id SERIAL PRIMARY KEY,
   name VARCHAR(20) NOT NULL,
   role VARCHAR(20) NOT NULL DEFAULT('user'),
   created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const user_group = `DROP TABLE IF EXISTS user_group; CREATE TABLE IF NOT EXISTS user_group (
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users (id) ON DELETE CASCADE,
   group_id INT REFERENCES groups (id) ON DELETE CASCADE,
   created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const message = `DROP TABLE IF EXISTS message; DROP TYPE IF EXISTS message_status; CREATE TYPE message_status AS ENUM ('sent', 'draft'); CREATE TABLE IF NOT EXISTS message (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(80) DEFAULT NULL,
    message TEXT DEFAULT NULL,
    created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parent_message_id INT REFERENCES message (id) ON DELETE CASCADE,
    sender_id INT REFERENCES users (id) ON DELETE CASCADE,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    status message_status
 );
`;

const inbox = `DROP TABLE IF EXISTS inbox; CREATE TABLE IF NOT EXISTS inbox (
    id SERIAL PRIMARY KEY,
    message_id INT REFERENCES message (id) ON DELETE CASCADE,
    receiver_id INT REFERENCES users (id) ON DELETE CASCADE,
    receiver_group_id INT REFERENCES user_group (id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE
 );
`;

const addAdmin = `INSERT INTO users (first_name, last_name, email, password, role)
VALUES('rurho', 'nyorere', 'admin@epicmail.com', 'ac1049kupa890', 'admin');`;

const addUser = `INSERT INTO users (first_name, last_name, email, password)
VALUES('rose', 'nyorere', 'user@epicmail.com', 'dc890kupa1049');`;

const dbTables = `${users} ${groups} ${user_group} ${message} ${inbox} ${addAdmin} ${addUser}`;

export default dbTables;
