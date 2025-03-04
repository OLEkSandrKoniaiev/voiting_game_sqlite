const express = require('express');
const router = express.Router();
const {getDB} = require('../services/db.service');

router.get('/', async (req, res) => {
    try {
        let {page, limit} = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const offset = (page - 1) * limit;
        const db = getDB();

        // Отримання жартів з бази
        const jokes = db.prepare('SELECT * FROM jokes LIMIT ? OFFSET ?').all(limit, offset);

        // Отримання загальної кількості жартів
        const totalJokes = db.prepare('SELECT COUNT(*) AS count FROM jokes').get().count;

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
