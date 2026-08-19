import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ─── Connection Pool ─────────────────────────────────────────────
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 5,          // Render free tier ke liye 5 enough hai
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  idleTimeout: 60000,          // 60 sec idle → connection free karo
});

// ─── Table Creation ──────────────────────────────────────────────
export async function initDatabase() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        pages INT DEFAULT 0,
        level VARCHAR(50) DEFAULT 'All Levels',
        description TEXT,
        file_path VARCHAR(500) DEFAULT NULL,
        file_name VARCHAR(500) DEFAULT NULL,
        drive_link VARCHAR(1000) DEFAULT NULL,
        downloads INT DEFAULT 0,
        rating DECIMAL(3,1) DEFAULT 5.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        topic VARCHAR(255) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ─── User Progress: Cross-device roadmap sync ─────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        completed_ids JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_email (email)
      )
    `);

    // ─── Roadmaps: Admin-managed roadmap tracks (global) ──────────
    // Admin jo bhi topic add/edit/delete kare wo yahan save hoga
    // Sab users/devices ko same data milega
    await conn.query(`
      CREATE TABLE IF NOT EXISTS roadmaps (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        icon VARCHAR(20) DEFAULT '🎯',
        color VARCHAR(20) DEFAULT '#3D5AFE',
        description TEXT,
        steps JSON NOT NULL DEFAULT '[]',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ MySQL tables ready (notes, messages, requests, user_progress, roadmaps)");
  } finally {
    conn.release();
  }
}

// ─── Graceful Shutdown ───────────────────────────────────────────
export async function closeDatabase() {
  await pool.end();
  console.log("🔒 MySQL pool closed");
}

export default pool;
