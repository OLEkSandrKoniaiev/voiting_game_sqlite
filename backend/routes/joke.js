const express = require('express');
const router = express.Router();
const {getDB} = require('../services/db.service');


// Endpoint for fetching a random joke
router.get('/', (req, res) => {
    try {
        const db = getDB();
        let joke = db.prepare('SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1').get();

        if (!joke) {
            return res.status(404).json({error: 'No jokes found'});
        }

        // Парсимо votes, якщо воно збережене у вигляді рядка JSON
        if (typeof joke.votes === "string") {
            joke.votes = JSON.parse(joke.votes);
        }

        res.json(joke);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch a joke'});
    }
});

// Endpoint for updating a joke's votes
router.patch('/:id', (req, res) => {
    try {
        const {id} = req.params;
        const {label} = req.query;

        if (!label) {
            return res.status(400).json({error: 'Label query parameter is required'});
        }

        const db = getDB();
        const joke = db.prepare('SELECT * FROM jokes WHERE id = ?').get(id);
        if (!joke) {
            return res.status(404).json({error: 'Joke not found'});
        }

        // Votes are stored as JSON in SQLite
        const votes = JSON.parse(joke.votes);
        const voteIndex = votes.findIndex(vote => vote.label === label);

        if (voteIndex === -1) {
            return res.status(400).json({error: 'Invalid vote label'});
        }

        votes[voteIndex].value += 1;

        db.prepare('UPDATE jokes SET votes = ? WHERE id = ?').run(JSON.stringify(votes), id);

        res.json({message: 'Vote updated successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to update joke'});
    }
});

// Endpoint for updating joke's question or answer
router.put('/:id', (req, res) => {
    try {
        const {id} = req.params;
        const {question, answer} = req.body;

        if (!question && !answer) {
            return res.status(400).json({error: 'No update fields provided'});
        }

        const db = getDB();
        const existingJoke = db.prepare('SELECT * FROM jokes WHERE id = ?').get(id);
        if (!existingJoke) {
            return res.status(404).json({error: 'Joke not found'});
        }

        db.prepare('UPDATE jokes SET question = COALESCE(?, question), answer = COALESCE(?, answer) WHERE id = ?')
            .run(question, answer, id);

        res.json({message: 'Joke updated successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to update joke'});
    }
});

// Endpoint for deleting a joke
router.delete('/:id', (req, res) => {
    try {
        const {id} = req.params;
        const db = getDB();

        const result = db.prepare('DELETE FROM jokes WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({error: 'Joke not found or already deleted'});
        }

        res.json({message: 'Joke deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to delete joke'});
    }
});

// Endpoint for adding new jokes to our local DB
router.post('/add', async (req, res) => {
    try {
        const response = await fetch('https://teehee.dev/api/joke');
        if (!response.ok) {
            return res.status(500).json({error: 'Invalid API response'});
        }

        const data = await response.json();
        if (!data?.question || !data?.answer) {
            return res.status(500).json({error: 'Invalid API response'});
        }

        const db = getDB();
        const existingJoke = db.prepare('SELECT * FROM jokes WHERE question = ? AND answer = ?').get(data.question, data.answer);

        if (existingJoke) {
            return res.status(409).json({error: 'Joke already exists'});
        }

        const jokeData = {
            question: data.question,
            answer: data.answer,
            votes: JSON.stringify([
                {value: 0, label: "funny"},
                {value: 0, label: "like"},
                {value: 0, label: "heart"},
                {value: 0, label: "dislike"},
                {value: 0, label: "angry"}
            ]),
            availableVotes: JSON.stringify(["funny", "like", "heart", "dislike", "angry"])
        };

        const result = db.prepare('INSERT INTO jokes (question, answer, votes, availableVotes) VALUES (?, ?, ?, ?)')
            .run(jokeData.question, jokeData.answer, jokeData.votes, jokeData.availableVotes);

        res.json({id: result.lastInsertRowid, ...jokeData});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch joke'});
    }
});

module.exports = router;
