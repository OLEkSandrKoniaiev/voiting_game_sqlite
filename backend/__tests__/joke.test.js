// describe('Basic Jest test', () => {
//     it('should add numbers correctly', () => {
//         expect(1 + 2).toBe(3);
//     });
//
//     test('should check string', () => {
//         expect('hello').toBe('hello');
//     });
// });

// jest.mock('../services/joke.service');
//
// const joke = require('../services/joke.service')
// const request = require('supertest');
// const app = require('../app');
//
// console.log(joke);
//
// describe('Jokes API', () => {
//     it('should return a joke', async () => {
//         const res = await request(app).get('/joke');
//         expect(res.statusCode).toBe(200);
//         expect(typeof res.body === 'object').toBe(true);
//         expect(joke.JokeService.getRandomJoke).toHaveBeenCalledTimes(1);
//     });

// it('should return a list of jokes', async () => {
//     const res = await request(app).get('/jokes');
//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body.data)).toBe(true);
// });

//     it('should add new joke to DB', async () => {
//         const res = await request(app).post('/joke/add');
//         expect(res.statusCode).toBe(201);
//         expect(typeof res.body === 'object').toBe(true);
//     });
// });

// it('should update joke`s vote number', async (id, label) => {
//     const res = await request(app).patch(`/joke/${id}?${label}`);
//     // не знайомий ще з цим
// });
//
// it('should update joke`s question or/and answer', async (id) => {
//     const res = await request(app).put(`/joke/${id}`);
//     // не знайомий ще з цим
//     // тут взагалі дані для оновлення даються в body
// });
//
// it('should delete joke', async (id) => {
//     const res = await request(app).delete(`/joke/${id}`);
//     // не знайомий ще з цим
// });

// beforeAll(() => {
//     console.log('Запускається перед всіма тестами');
// });
//
// afterAll(() => {
//     console.log('Виконується після всіх тестів');
// });

// const jokeService = require('../services/joke.service');
// const request = require('supertest');
// const app = require('../app');
//
// describe('Jokes API', () => {
//     beforeEach(() => {
//         // jest.spyOn(jokeService, 'getRandomJoke').mockResolvedValue({
//         //     id: 1,
//         //     question: "Why did the chicken cross the road?",
//         //     answer: "Because"
//         // });
//         //
//         // jest.spyOn(jokeService, 'getJokes').mockResolvedValue({
//         //     totalJokes: 1,
//         //     page: 1,
//         //     totalPages: 1,
//         //     limit: 10,
//         //     data: [{
//         //         id: 1,
//         //         question: "Why did the chicken cross the road?",
//         //         answer: "Because"
//         //     }]
//         // });
//         //
//         // jest.spyOn(jokeService, 'addJokeFromAPI').mockResolvedValue({
//         //     id: 2,
//         //     question: "New joke",
//         //     answer: "next answer"
//         // });
//         //
//         // jest.spyOn(jokeService, 'updateJokeVotes').mockResolvedValue({
//         //     message: 'Vote updated successfully'
//         // });
//         //
//         // jest.spyOn(jokeService, 'updateJokeText').mockResolvedValue({
//         //     message: 'Joke updated successfully'
//         // });
//         //
//         // jest.spyOn(jokeService, 'deleteJoke').mockResolvedValue({
//         //     message: 'Joke deleted successfully'
//         // });
//     });
//
//     afterEach(() => {
//         // jest.restoreAllMocks();
//     });
//
//     it('should return a joke', async () => {
//         const res = await request(app).get('/joke');
//         expect(res.statusCode).toBe(200);
//         expect(typeof res.body === 'object').toBe(true);
//         expect(jokeService.getRandomJoke).toHaveBeenCalledTimes(1);
//     });
//
//     it('should return a list of jokes', async () => {
//         const res = await request(app).get('/jokes?page=1&limit=10');
//         expect(res.statusCode).toBe(200);
//         console.log(res.body);
//         expect(Array.isArray(res.body.data)).toBe(true);
//         expect(jokeService.getJokes).toHaveBeenCalledTimes(1);
//     });
//
//     it('should add new joke to DB', async () => {
//         const res = await request(app).post('/joke/add');
//         expect(res.statusCode).toBe(201);
//         expect(typeof res.body === 'object').toBe(true);
//         expect(jokeService.addJokeFromAPI).toHaveBeenCalledTimes(1);
//     });
//
//     it('should update joke votes', async () => {
//         const res = await request(app)
//             .patch('/joke/1?label=funny')
//             .expect(200)
//             .expect('Content-Type', /json/);
//         console.log(res.body);
//
//         expect(res.statusCode).toBe(200);
//         expect(res.body.message).toBe('Vote updated successfully');
//         expect(jokeService.updateJokeVotes).toHaveBeenCalledTimes(1);
//     });
//
//     it('should update joke text', async () => {
//         const res = await request(app).put('/joke/100').send({
//             question: "Updated joke?",
//             answer: "Updated answer"
//         });
//         expect(res.statusCode).toBe(200);
//         console.log(res.body);
//         expect(res.body.message).toBe('Joke updated successfully');
//         expect(jokeService.updateJokeText).toHaveBeenCalledTimes(1);
//     });
//
//     it('should delete a joke', async () => {
//         const res = await request(app).delete('/joke/100');
//         expect(res.statusCode).toBe(200);
//         console.log(res.body);
//         expect(res.body.message).toBe('Joke deleted successfully');
//         expect(jokeService.deleteJoke).toHaveBeenCalledTimes(1);
//     });
// });

const request = require('supertest');
const app = require('../app');

describe('Jokes API', () => {
    it('should return a joke', async () => {
        const res = await request(app).get('/joke').expect(200);
        expect(res.body).toMatchObject({
            id: expect.any(Number),
            question: expect.any(String),
            answer: expect.any(String),
            votes: expect.arrayContaining([
                expect.objectContaining({
                    value: expect.any(Number),
                    label: expect.any(String)
                })
            ]),
            availableVotes: expect.any(String)
        });
        // console.log('Random joke response:', res.body);
    });


    it('should return a list of jokes', async () => {
        const res = await request(app).get('/jokes?page=1&limit=3').expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        // console.log('Jokes list response:', res.body);
    });

    it('should add new joke to DB', async () => {
        const res = await request(app).post('/joke/add').expect(201);
        expect(res.body).toMatchObject({
            id: expect.any(Number),
            question: expect.any(String),
            answer: expect.any(String),
            votes: expect.arrayContaining([
                expect.objectContaining({
                    value: expect.any(Number),
                    label: expect.any(String)
                })
            ]),
            availableVotes: expect.any(String)
        });
        // console.log('Add joke response:', res.body);
    });

    it('should update joke votes', async () => {
        const res = await request(app).patch('/joke/102?label=funny').expect(200)
        // console.log('Update votes response:', res.body);
        expect(res.body.message).toBe('Vote updated successfully');
    });

    it('should update joke text', async () => {
        const res = await request(app).put('/joke/102').send({
            question: "Updated joke?",
            answer: "Updated answer"
        }).expect(200);
        // console.log('Update joke response:', res.body);
        expect(res.body.message).toBe('Joke updated successfully');
    });

    // it('should delete a joke', async () => {
    //     const res = await request(app).delete('/joke/101').expect(200);
    //     console.log('Delete joke response:', res.body);
    //     expect(res.body.message).toBe('Joke deleted successfully');
    // });
});

