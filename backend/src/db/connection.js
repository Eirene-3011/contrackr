const mysql = require('mysql2/promise');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const isTiDB = process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com');

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'contrackr_db',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
};

if (isProduction || isTiDB) {
  poolConfig.ssl = {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2',
  };
}

const pool = mysql.createPool(poolConfig);

pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL database connected successfully');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message);
    if (isProduction) {
      process.exit(1);
    }
  });

module.exports = pool;
