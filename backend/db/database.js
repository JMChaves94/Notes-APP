const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'notes_app',
  password: '1234',
  port: 5432,
});

console.log('PostgreSQL pool ready');

module.exports = pool;
