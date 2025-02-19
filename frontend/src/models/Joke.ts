export interface Joke {
    "question": string,
    "answer": string,
    "votes": Vote[],
    "availableVotes": string[],
    "_id": string
}


type Vote = {
    "value": number,
    "label": string
}
