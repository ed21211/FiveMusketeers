import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'musksdb.cw5opdtderna.us-east-1.rds.amazonaws.com',
  database: 'order_creation',
  password: 'seng2021',
  port: 5432,
  ssl: { rejectUnauthorized: false } // SSL encryption
});


export default pool;

