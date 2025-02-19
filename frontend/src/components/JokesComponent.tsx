import {Joke} from "../models/Joke.ts";
import {JokeComponent} from "./JokeComponent.tsx";

interface JokesComponentProps {
    jokes: Joke[];
    loading: boolean;
    handleDelete: (id: string) => void;
    handleEdit: (joke: Joke) => void;
}

export const JokesComponent = ({jokes, loading, handleDelete, handleEdit}: JokesComponentProps) => {
    if (loading) return <p className='p'>Loading...</p>;

    if (jokes.length === 0) return <p className='p'>No jokes found.</p>;

    return (
        <div>
            {jokes.map((joke) => (
                <div key={joke._id} className='flex flex-col items-start'>
                    <JokeComponent question={joke.question} answer={joke.answer}/>
                    <div className='flex flex-row justify-between w-52 pl-2.5'>
                        <button onClick={() => handleEdit(joke)} className='btn'>Edit</button>
                        <button onClick={() => handleDelete(joke._id)} className='btn'>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
