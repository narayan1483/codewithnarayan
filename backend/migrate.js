/**
 * migrate.js — One-time script to import existing data.json into MySQL
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pool, { initDatabase, closeDatabase } from "./db.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, "data.json");

function formatMySqlDate(isoString) {
  if (!isoString) return new Date().toISOString().slice(0, 19).replace("T", " ");
  try {
    return new Date(isoString).toISOString().slice(0, 19).replace("T", " ");
  } catch (e) {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  }
}

async function migrate() {
  console.log("🚀 Starting migration from data.json → MySQL...\n");

  await initDatabase();

  if (!fs.existsSync(dataFile)) {
    console.log("⚠️  data.json not found — nothing to migrate.");
    await closeDatabase();
    return;
  }

  const raw = fs.readFileSync(dataFile, "utf-8");
  const data = JSON.parse(raw);

  const notes = data.notes || [];
  if (notes.length > 0) {
    const [existing] = await pool.query("SELECT COUNT(*) as count FROM notes");
    if (existing[0].count > 0) {
      console.log(`ℹ️  Notes table already has ${existing[0].count} rows — skipping note migration.`);
    } else {
      console.log(`📝 Migrating ${notes.length} notes...`);
      for (const note of notes) {
        await pool.query(
          `INSERT INTO notes (title, subject, pages, level, description, file_path, file_name, drive_link, downloads, rating, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            note.title,
            note.subject,
            note.pages || 0,
            note.level || "All Levels",
            note.description || "",
            note.file_path || null,
            note.file_name || null,
            note.drive_link || null,
            note.downloads || 0,
            note.rating || 5.0,
            formatMySqlDate(note.created_at),
          ]
        );
        console.log(`   ✅ "${note.title}"`);
      }
      console.log(`\n✅ ${notes.length} notes migrated successfully!\n`);
    }
  }

  const messages = data.messages || [];
  if (messages.length > 0) {
    const [existing] = await pool.query("SELECT COUNT(*) as count FROM messages");
    if (existing[0].count > 0) {
      console.log(`ℹ️  Messages table already has ${existing[0].count} rows — skipping message migration.`);
    } else {
      console.log(`💬 Migrating ${messages.length} messages...`);
      for (const msg of messages) {
        await pool.query(
          "INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, ?)",
          [msg.name, msg.email, msg.message, formatMySqlDate(msg.created_at)]
        );
        console.log(`   ✅ Message from "${msg.name}"`);
      }
      console.log(`\n✅ ${messages.length} messages migrated successfully!\n`);
    }
  }

  console.log("🎉 Migration complete! Your data is now safely in MySQL.");
  await closeDatabase();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
