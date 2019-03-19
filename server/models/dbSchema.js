/**
 * Table creation Query
 */

const users = `DROP TABLE IF EXISTS users; DROP TYPE IF EXISTS user_role; Create TYPE user_role AS ENUM('user', 'admin'); CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   first_name VARCHAR(20) NOT NULL,
   last_name VARCHAR(20) NOT NULL,
   email VARCHAR(50) UNIQUE NOT NULL,
   password VARCHAR(150) NOT NULL,
   role user_role DEFAULT 'user',
   created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const groups = `DROP TABLE IF EXISTS groups; DROP TYPE IF EXISTS user_type; Create TYPE user_type AS ENUM('user', 'admin'); CREATE TABLE IF NOT EXISTS groups (
   id SERIAL PRIMARY KEY,
   group_name VARCHAR(20) NOT NULL,
   role user_type DEFAULT 'user',
   owner_id INT NOT NULL,
   created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const user_group = `DROP TABLE IF EXISTS user_group; CREATE TABLE IF NOT EXISTS user_group (
   id SERIAL PRIMARY KEY,
   group_name VARCHAR(20) NOT NULL,
   role VARCHAR(20) NOT NULL,
   user_id INT REFERENCES users (id) ON DELETE CASCADE,
   group_id INT REFERENCES groups (id) ON DELETE CASCADE,
   created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const group_message = `DROP TABLE IF EXISTS group_message; CREATE TABLE IF NOT EXISTS group_message (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(20) NOT NULL,
    subject VARCHAR(80) NOT NULL,
    message TEXT NOT NULL,
    created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    owner_id INT NOT NULL
 );
`;

const message = `DROP TABLE IF EXISTS message; DROP TYPE IF EXISTS message_status; Create TYPE message_status AS ENUM('sent', 'draft'); CREATE TABLE IF NOT EXISTS message (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(80) NOT NULL,
    message TEXT NOT NULL,
    created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parent_message_id INT REFERENCES message (id) ON DELETE CASCADE,
    sender_id INT REFERENCES users (id) ON DELETE CASCADE,
    status message_status DEFAULT 'draft'
 );
`;

const sent = `DROP TABLE IF EXISTS sent; CREATE TABLE IF NOT EXISTS sent (
    sender_id INT REFERENCES users (id) ON DELETE CASCADE,
    message_id INT REFERENCES message (id) ON DELETE CASCADE,
    created_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
 );
`;

const inbox = `DROP TABLE IF EXISTS inbox; DROP TYPE IF EXISTS msg_status; Create TYPE msg_status AS ENUM('unread', 'read'); CREATE TABLE IF NOT EXISTS inbox (
    id SERIAL PRIMARY KEY,
    message_id INT REFERENCES message (id) ON DELETE CASCADE,
    receiver_id INT REFERENCES users (id) ON DELETE CASCADE,
    receiver_group_id INT REFERENCES user_group (id) ON DELETE CASCADE,
    status msg_status default 'unread'
 );
`;

const addAdmin = `INSERT INTO users (first_name, last_name, email, password, role)
VALUES('rurho', 'nyorere', 'admin@epicmail.com', 'ac1049kupa890', 'admin');`;

const addUser = `INSERT INTO users (first_name, last_name, email, password)
VALUES('rose', 'nyorere', 'user@epicmail.com', 'dc890kupa1049');`;

const dbTables = `${users} ${groups} ${user_group} ${group_message} ${message} ${inbox} ${sent} ${addAdmin} ${addUser}`;

export default dbTables;