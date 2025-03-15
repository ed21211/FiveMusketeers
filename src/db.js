const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'musksdb.cw5opdtderna.us-east-1.rds.amazonaws.com',
  database: 'order_creation',
  password: 'seng2021',
  port: 5432,
});

pool.connect()
  .then(() => {
    console.log("Successfully connected to the database!");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.stack);
  });

module.exports = pool;

