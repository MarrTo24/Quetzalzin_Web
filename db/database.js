const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:              process.env.DB_HOST     || 'localhost',
  port:              parseInt(process.env.DB_PORT || '3306'),
  user:              process.env.DB_USER     || 'root',
  password:          process.env.DB_PASS     || '',
  database:          process.env.DB_NAME     || 'quetzalzin',
  waitForConnections: true,
  connectionLimit:   10,
  queueLimit:        0,
  timezone:          '+00:00',
  charset:           'utf8mb4',
});

async function initDB() {
  const conn = await pool.getConnection();
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id            INT PRIMARY KEY AUTO_INCREMENT,
        order_number  VARCHAR(30) UNIQUE NOT NULL,
        customer_name VARCHAR(200) NOT NULL,
        customer_phone VARCHAR(30) NOT NULL,
        customer_email VARCHAR(200),
        delivery_point VARCHAR(100) NOT NULL,
        address       TEXT,
        items         JSON NOT NULL,
        total         DECIMAL(10,2) NOT NULL,
        notes         TEXT,
        status        ENUM('pending','confirmed','preparing','shipped','delivered','cancelled')
                      NOT NULL DEFAULT 'pending',
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id                 INT PRIMARY KEY AUTO_INCREMENT,
        appointment_number VARCHAR(30) UNIQUE NOT NULL,
        customer_name      VARCHAR(200) NOT NULL,
        customer_phone     VARCHAR(30) NOT NULL,
        customer_email     VARCHAR(200),
        service            VARCHAR(200) NOT NULL,
        date               DATE NOT NULL,
        time_slot          VARCHAR(50) NOT NULL,
        comments           TEXT,
        status             ENUM('pending','confirmed','completed','cancelled')
                           NOT NULL DEFAULT 'pending',
        created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id            INT PRIMARY KEY AUTO_INCREMENT,
        username      VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // Índices adicionales (IF NOT EXISTS no existe en MySQL para índices, ignorar error)
    for (const sql of [
      'CREATE INDEX idx_orders_status  ON orders(status)',
      'CREATE INDEX idx_orders_created ON orders(created_at)',
      'CREATE INDEX idx_appts_date     ON appointments(date)',
      'CREATE INDEX idx_appts_status   ON appointments(status)',
    ]) {
      await conn.execute(sql).catch(() => {});
    }

    console.log('✅ Base de datos MySQL inicializada');
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDB };
