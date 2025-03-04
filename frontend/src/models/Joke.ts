export interface Joke {
    "question": string,
    "answer": string,
    "votes": Vote[],
    "availableVotes": string[],
    "id": string
}


type Vote = {
    "value": number,
    "label": string
}
