const express = require('express');
const router = express.Router();
const JokeService = require('../services/joke.service');

router.get('/', (req, res) => {
    try {
        const joke = JokeService.getRandomJoke();
        if (!joke) {
            return res.status(404).json({error: 'No jokes found'});
        }
        res.json(joke);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch a joke'});
    }
});

router.post('/add', async (req, res) => {
    try {
        const newJoke = await JokeService.addJokeFromAPI();
        res.status(201).json(newJoke);
    } catch (error) {
        console.error(error);
        res.status(error.message === 'Joke already exists' ? 409 : 500).json({error: error.message});
    }
});

router.patch('/:id', (req, res) => {
    try {
        const {id} = req.params;
        const {label} = req.query;

        if (!label) {
            return res.status(400).json({error: 'Label query parameter is required'});
        }

        const response = JokeService.updateJokeVotes(id, label);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(error.message === 'Joke not found' ? 404 : 400).json({error: error.message});
    }
});

router.put('/:id', (req, res) => {
    try {
        const {id} = req.params;
        const {question, answer} = req.body;

        if (!question && !answer) {
            return res.status(400).json({error: 'No update fields provided'});
        }

        const response = JokeService.updateJokeText(id, question, answer);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(error.message === 'Joke not found' ? 404 : 500).json({error: error.message});
    }
});

router.delete('/:id', (req, res) => {
    try {
        const {id} = req.params;
        const response = JokeService.deleteJoke(id);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(error.message.includes('not found') ? 404 : 500).json({error: error.message});
    }
});

module.exports = router;
