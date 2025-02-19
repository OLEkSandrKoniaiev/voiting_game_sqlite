import {useEffect, useState} from "react";
import {jokesService} from "../services/jokes.service.ts";
import {Joke} from "../models/Joke.ts";
import {Link} from "react-router-dom";
import {JokesComponent} from "../components/JokesComponent.tsx";

export const JokesPage = () => {
    const [jokes, setJokes] = useState<Joke[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [editJoke, setEditJoke] = useState<{ id: string; question: string; answer: string } | null>(null);

    const fetchJokes = async () => {
        setLoading(true);
        const response = await jokesService.getJokes(page, 5);
        if (response) {
            setJokes(response.data);
            setTotalPages(response.totalPages);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchJokes().then();
    }, [page]);

    const handleDelete = async (id: string) => {
        await jokesService.deleteJoke(id);
        fetchJokes().then();
    };

    const handleEdit = (joke: Joke) => {
        setEditJoke({id: joke._id, question: joke.question, answer: joke.answer});
    };

    const handleSaveEdit = async () => {
        if (editJoke) {
            await jokesService.updateJoke(editJoke.id, {question: editJoke.question, answer: editJoke.answer});
            setEditJoke(null);
            fetchJokes().then();
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row justify-center items-center mt-2">
                <h1 className="h1 mr-2">Jokes List</h1>
                <Link to="/joke" className='link'>Go to Random Joke</Link>
            </div>

            {editJoke && (
                <div className="flex flex-col items-center mt-6 w-full">
                    <h2 className='h2'>Edit Joke</h2>
                    <div className="flex flex-col w-full">
                        <input
                            type="text"
                            value={editJoke.question}
                            onChange={(e) => setEditJoke((prev) => prev ? {...prev, question: e.target.value} : null)}
                            className="input-field"
                        />
                        <input
                            type="text"
                            value={editJoke.answer}
                            onChange={(e) => setEditJoke((prev) => prev ? {...prev, answer: e.target.value} : null)}
                            className="input-field"
                        />
                    </div>
                    <div className="flex flex-row justify-between w-64">
                        <button onClick={handleSaveEdit} className='btn'>Save</button>
                        <button onClick={() => setEditJoke(null)} className='btn'>Cancel</button>
                    </div>
                </div>
            )}

            <div className="mt-12">
                <JokesComponent jokes={jokes} loading={loading} handleDelete={handleDelete} handleEdit={handleEdit}/>
            </div>

            <div className="flex flex-row justify-around mt-6 w-full">
                <button onClick={() => setPage((prev) =>
                    Math.max(prev - 1, 1))} disabled={page === 1}
                        className='btn'>
                    Prev
                </button>
                <span className='span'>Page {page} of {totalPages}</span>
                <button onClick={() => setPage((prev) =>
                    Math.min(prev + 1, totalPages))} disabled={page === totalPages}
                        className='btn'>
                    Next
                </button>
            </div>
        </div>
    );
};
