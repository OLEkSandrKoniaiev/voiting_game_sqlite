const express = require('express');
const router = express.Router();
const JokeService = require('../services/joke.service');

router.get('/', (req, res) => {
    try {
        const {page, limit} = req.query;
        const response = JokeService.getJokes(page, limit);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch jokes'});
    }
});

module.exports = router;
