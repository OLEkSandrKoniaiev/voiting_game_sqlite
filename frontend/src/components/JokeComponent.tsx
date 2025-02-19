interface JokeComponentProps {
    question: string;
    answer: string;
}

export const JokeComponent = ({question, answer}: JokeComponentProps) => {
    return (
        <div>
            <h1 className='h1'>{question}</h1>
            <h2 className='h2'>{answer}</h2>
        </div>
    );
};
