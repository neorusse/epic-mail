/**
 * Table creation Query
 */

const users = `DROP TABLE IF EXISTS users; CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   first_name VARCHAR(20) NOT NULL,
   last_name VARCHAR(20) NOT NULL,
   email VARCHAR(50) UNIQUE NOT NULL,
   password VARCHAR(150) NOT NULL,
   created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const groups = `DROP TABLE IF EXISTS groups; CREATE TABLE IF NOT EXISTS groups (
   id SERIAL PRIMARY KEY,
   group_name VARCHAR(50) NOT NULL,
   created_by INT REFERENCES users (id) ON DELETE CASCADE,
   created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const group_members = `DROP TABLE IF EXISTS group_members; CREATE TABLE IF NOT EXISTS group_members (
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users (id) ON DELETE CASCADE,
   group_id INT REFERENCES groups (id) ON DELETE CASCADE,
   role VARCHAR(20) NOT NULL,
   created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const message = `DROP TABLE IF EXISTS message; CREATE TABLE IF NOT EXISTS message (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(80) NOT NULL,
    message TEXT NOT NULL,
    parent_message_id INT REFERENCES message (id) ON DELETE CASCADE,
    sender_id INT REFERENCES users (id) ON DELETE CASCADE,
    created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(80) NOT NULL
 );
`;

const sent = `DROP TABLE IF EXISTS sent; CREATE TABLE IF NOT EXISTS sent (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users (id) ON DELETE CASCADE,
    message_id INT REFERENCES message (id) ON DELETE CASCADE,
    created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const inbox = `DROP TABLE IF EXISTS inbox; CREATE TABLE IF NOT EXISTS inbox (
    id SERIAL PRIMARY KEY,
    message_id INT REFERENCES message (id) ON DELETE CASCADE,
    receiver_id INT REFERENCES users (id) ON DELETE CASCADE,
    receiver_group_id INT REFERENCES group_members (id) ON DELETE CASCADE,
    status VARCHAR(80) NOT NULL DEFAULT 'unread'
 );
`;

const dbTables = `${users} ${groups} ${group_members} ${message} ${sent} ${inbox}`;

export default dbTables;
