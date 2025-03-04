import {useEffect, useState} from "react";
import {jokesService} from "../services/jokes.service.ts";
import {Joke} from "../models/Joke.ts";
import {Link} from "react-router-dom";
import {JokeComponent} from "../components/JokeComponent.tsx";

const voteEmojis: Record<string, string> = {
    funny: "😂",
    like: "👍",
    heart: "❤️",
    dislike: "👎",
    angry: "😡"
};

export const JokePage = () => {
    const [joke, setJoke] = useState<Joke | null>(null);
    const [selectedVote, setSelectedVote] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchJoke = async () => {
        setLoading(true);
        const response = await jokesService.getJoke();
        console.log("Fetched joke:", response);
        setJoke(response);
        setSelectedVote(null);
        setLoading(false);
    };

    useEffect(() => {
        fetchJoke().then();
    }, []);

    const handleVote = async (voteLabel: string) => {
        if (!joke || selectedVote) return;

        await jokesService.voteJoke(joke.id, voteLabel);
        setSelectedVote(voteLabel);

        setJoke(prev => prev ? {
            ...prev,
            votes: prev.votes.map(vote =>
                vote.label === voteLabel ? {...vote, value: vote.value + 1} : vote
            )
        } : null);

        setTimeout(fetchJoke, 2000);
    };

    // ✅ Гарантовано отримуємо масив `availableVotes`
    let availableVotes: string[] = [];
    if (joke) {
        try {
            availableVotes = Array.isArray(joke.availableVotes)
                ? joke.availableVotes
                : JSON.parse(joke.availableVotes || '[]');
        } catch (error) {
            console.error("Failed to parse availableVotes:", error);
            availableVotes = [];
        }
    }

    return (
        <div>
            <div className="flex flex-row items-center justify-center mt-2">
                <h1 className="h1 mr-2">Random Joke</h1>
                <Link to="/jokes" className="link">Go to Jokes List</Link>
            </div>

            {loading && <p className="p">Loading...</p>}

            {joke && !loading && (
                <div className='flex flex-col items-center mt-12'>
                    <JokeComponent question={joke.question} answer={joke.answer}/>
                    <div className="flex flex-row justify-around w-128 mt-6">
                        {availableVotes.map((availableVote) => {
                            // ✅ Гарантуємо, що `votes` існують
                            const voteValue = (joke.votes || []).find(vote => vote.label === availableVote)?.value || 0;
                            return (
                                <button
                                    key={availableVote}
                                    onClick={() => handleVote(availableVote)}
                                    disabled={!!selectedVote}
                                    className='btn'>
                                    {voteEmojis[availableVote] || availableVote} {voteValue}
                                </button>
                            );
                        })}
                    </div>
                    {selectedVote && <p className='p'>New joke in 2 seconds...</p>}
                </div>
            )}
        </div>
    );
};
