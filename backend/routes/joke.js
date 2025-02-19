const express = require('express');
const {ObjectId} = require('mongodb');

const router = express.Router();


let {getCollection} = require('../services/db.service');

// Endpoint for new joke from out DB
router.get('/', async (req, res) => {
    try {
        const collection = getCollection();
        const count = await collection.countDocuments();
        if (count === 0) {
            return res.status(404).json({error: 'No jokes found'});
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomJoke = await collection.find().limit(1).skip(randomIndex).toArray();

        res.json(randomJoke[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch a joke'});
    }
});

// Endpoint for count reactions
// I cannot use POST method, due to a conflict with the data structure.
// If we use the POST method, then we don't need the ‘votes’ field at least and ‘availableVotes’ at most.
// Then each reaction will be a separate object in the database.
// And in this case, it would be worth implementing a user with authorisation
router.patch('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {label} = req.query;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid joke ID'});
        }

        if (!label) {
            return res.status(400).json({error: 'Label query parameter is required'});
        }

        const collection = getCollection();
        const joke = await collection.findOne({_id: new ObjectId(id)});
        if (!joke) {
            return res.status(404).json({error: 'Joke not found'});
        }

        const voteIndex = joke.votes.findIndex(vote => vote.label === label);
        if (voteIndex === -1) {
            return res.status(400).json({error: 'Invalid vote label'});
        }

        const updateQuery = {[`votes.${voteIndex}.value`]: 1};

        const result = await collection.updateOne(
            {_id: new ObjectId(id)},
            {$inc: updateQuery}
        );

        if (result.modifiedCount === 0) {
            return res.status(500).json({error: 'Failed to update joke'});
        }

        res.json({message: 'Vote updated successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to update joke'});
    }
});

// Endpoint for updating joke's question or answer
router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {question, answer} = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid joke ID'});
        }

        if (!question && !answer) {
            return res.status(400).json({error: 'No update fields provided'});
        }

        const updateQuery = {};
        if (question) updateQuery.question = question;
        if (answer) updateQuery.answer = answer;

        const collection = getCollection();
        const result = await collection.updateOne(
            {_id: new ObjectId(id)},
            {$set: updateQuery}
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({error: 'Joke not found or no changes made'});
        }

        res.json({message: 'Joke updated successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to update joke'});
    }
});

// Endpoint for deleting a joke
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid joke ID'});
        }

        const collection = getCollection();
        const result = await collection.deleteOne({_id: new ObjectId(id)});

        if (result.deletedCount === 0) {
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

        const collection = getCollection();

        const existingJoke = await collection.findOne({
            question: data.question,
            answer: data.answer
        });

        if (existingJoke) {
            return res.status(409).json({error: 'Joke already exists'});
        }

        const joke_data = {
            question: data.question,
            answer: data.answer,
            votes: [
                {value: 0, label: "funny"},
                {value: 0, label: "like"},
                {value: 0, label: "heart"},
                {value: 0, label: "dislike"},
                {value: 0, label: "angry"}
            ],
            availableVotes: ["funny", "like", "heart", "dislike", "angry"]
        };

        const result = await collection.insertOne(joke_data);

        console.log(`Joke added: ${result.insertedId}`);
        res.json(joke_data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message || 'Failed to fetch joke'});
    }
});

module.exports = router;
