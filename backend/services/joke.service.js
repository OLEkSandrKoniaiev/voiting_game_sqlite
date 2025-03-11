const JokeRepository = require('../repositories/joke.repository');

class JokeService {
    static getRandomJoke() {
        const joke = JokeRepository.getRandomJoke();
        if (!joke) return null;

        if (typeof joke.votes === "string") {
            joke.votes = JSON.parse(joke.votes);
        }
        return joke;
    }

    static getJokes(page, limit) {
        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const offset = (page - 1) * limit;
        const {jokes, totalJokes} = JokeRepository.getJokes(limit, offset);

        return {
            totalJokes,
            page,
            totalPages: Math.ceil(totalJokes / limit),
            limit,
            data: jokes,
        };
    }

    static async addJokeFromAPI() {
        const response = await fetch('https://teehee.dev/api/joke');
        if (!response.ok) {
            throw new Error('Invalid API response');
        }

        const data = await response.json();
        if (!data?.question || !data?.answer) {
            throw new Error('Invalid API response');
        }

        const existingJoke = JokeRepository.getJokeByQuestionAndAnswer(data.question, data.answer);
        if (existingJoke) {
            throw new Error('Joke already exists');
        }

        const votes = JSON.stringify([
            {value: 0, label: "funny"},
            {value: 0, label: "like"},
            {value: 0, label: "heart"},
            {value: 0, label: "dislike"},
            {value: 0, label: "angry"}
        ]);

        const availableVotes = JSON.stringify(["funny", "like", "heart", "dislike", "angry"]);

        const jokeId = JokeRepository.createJoke(data.question, data.answer, votes, availableVotes);

        return {id: jokeId, question: data.question, answer: data.answer, votes, availableVotes};
    }

    static updateJokeVotes(id, label) {
        const joke = JokeRepository.getJokeById(id);
        if (!joke) throw new Error('Joke not found');

        const votes = JSON.parse(joke.votes);
        const voteIndex = votes.findIndex(vote => vote.label === label);

        if (voteIndex === -1) throw new Error('Invalid vote label');

        votes[voteIndex].value += 1;

        JokeRepository.updateJokeVotes(id, JSON.stringify(votes));

        return {message: 'Vote updated successfully'};
    }

    static updateJokeText(id, question, answer) {
        const existingJoke = JokeRepository.getJokeById(id);
        if (!existingJoke) throw new Error('Joke not found');

        JokeRepository.updateJokeText(id, question, answer);
        return {message: 'Joke updated successfully'};
    }

    static deleteJoke(id) {
        const result = JokeRepository.deleteJoke(id);
        if (result.changes === 0) throw new Error('Joke not found or already deleted');

        return {message: 'Joke deleted successfully'};
    }
}

module.exports = JokeService;
