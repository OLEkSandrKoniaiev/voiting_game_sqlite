const {MongoClient} = require('mongodb');

const uri = 'mongodb://root:root@localhost:27017/';
const client = new MongoClient(uri);

let db, collection;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('joke_game');
        collection = db.collection('jokes');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

function getCollection() {
    if (!collection) {
        throw new Error('Database not initialized. Call connectDB() first.');
    }
    return collection;
}

module.exports = {connectDB, getCollection};
