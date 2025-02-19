const express = require('express');
const router = express.Router();

const {getCollection} = require('../services/db.service');


router.get('/', async (req, res) => {
    try {
        let {page, limit} = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const skip = (page - 1) * limit;

        const collection = getCollection();
        const jokes = await collection.find().skip(skip).limit(limit).toArray();
        const totalJokes = await collection.countDocuments();

        res.json({
            totalJokes,
            page,
            totalPages: Math.ceil(totalJokes / limit),
            limit,
            data: jokes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch jokes'});
    }
});

module.exports = router;
