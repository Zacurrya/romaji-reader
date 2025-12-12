type QuizHistoryBarProps = {
    history: (boolean | null)[];
    currentQuestionIndex: number;
};

export default function QuizHistoryBar({ history, currentQuestionIndex }: QuizHistoryBarProps) {
    return (
        <div className="flex gap-2 w-full mb-8 px-1">
            {history.map((result, idx) => (
                <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${result === true ? 'bg-green-500 shadow-sm shadow-green-200' :
                            result === false ? 'bg-red-500 shadow-sm shadow-red-200' :
                                idx === currentQuestionIndex ? 'bg-blue-400 scale-110' : 'bg-gray-200'
                        }`}
                />
            ))}
        </div>
    );
}
