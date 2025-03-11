const {getDB} = require('../services/db.service');

class JokeRepository {
    static getRandomJoke() {
        const db = getDB();
        return db.prepare('SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1').get();
    }

    static getJokes(limit, offset) {
        const db = getDB();
        const jokes = db.prepare('SELECT * FROM jokes LIMIT ? OFFSET ?').all(limit, offset);
        const totalJokes = db.prepare('SELECT COUNT(*) AS count FROM jokes').get().count;
        return {jokes, totalJokes};
    }

    static getJokeById(id) {
        const db = getDB();
        return db.prepare('SELECT * FROM jokes WHERE id = ?').get(id);
    }

    static getJokeByQuestionAndAnswer(question, answer) {
        const db = getDB();
        return db.prepare('SELECT * FROM jokes WHERE question = ? AND answer = ?').get(question, answer);
    }

    static createJoke(question, answer, votes, availableVotes) {
        const db = getDB();
        const stmt = db.prepare('INSERT INTO jokes (question, answer, votes, availableVotes) VALUES (?, ?, ?, ?)');
        const result = stmt.run(question, answer, votes, availableVotes);
        return result.lastInsertRowid;
    }

    static updateJokeVotes(id, votes) {
        const db = getDB();
        return db.prepare('UPDATE jokes SET votes = ? WHERE id = ?').run(votes, id);
    }

    static updateJokeText(id, question, answer) {
        const db = getDB();
        return db.prepare('UPDATE jokes SET question = COALESCE(?, question), answer = COALESCE(?, answer) WHERE id = ?')
            .run(question, answer, id);
    }

    static deleteJoke(id) {
        const db = getDB();
        return db.prepare('DELETE FROM jokes WHERE id = ?').run(id);
    }
}

module.exports = JokeRepository;
