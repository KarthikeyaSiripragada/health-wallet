const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function initDB() {
    // Open the SQLite database file
    const db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    // 1. Create Users Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            phone TEXT UNIQUE, -- Added phone column
            password TEXT
        )
    `);
    // 2. Create Vitals Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS vitals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            type TEXT,
            value TEXT,
            unit TEXT,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id)
        )
    `);
    // 4. Create Access Control Table (REQUIRED)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS access_control (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_id INTEGER,
            owner_id INTEGER,
            shared_with_user_id INTEGER,
            FOREIGN KEY (report_id) REFERENCES reports(id),
            FOREIGN KEY (owner_id) REFERENCES users(id),
            FOREIGN KEY (shared_with_user_id) REFERENCES users(id)
        )
    `);

    // 3. Create Reports Table (Only needed once)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER, 
            type TEXT,
            date TEXT,
            filePath TEXT,
            FOREIGN KEY (userId) REFERENCES users(id)
        )
    `);

    return db;
}

module.exports = initDB;