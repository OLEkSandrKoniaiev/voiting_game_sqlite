const Database = require('better-sqlite3');

let db;

function connectDB() {
    try {
        db = new Database('jokes.db');
        db.exec(`
            CREATE TABLE IF NOT EXISTS jokes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT UNIQUE,
                answer TEXT,
                votes TEXT,
                availableVotes TEXT
            )
        `);
        console.log('Connected to SQLite');
    } catch (error) {
        console.error('Failed to connect to SQLite', error);
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB() first.');
    }
    return db;
}

module.exports = { connectDB, getDB };
