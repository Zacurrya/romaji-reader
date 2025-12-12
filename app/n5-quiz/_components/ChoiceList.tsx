"use client";

type ChoiceListProps = {
    options: string[];
    correctAnswer: string | string[];
    selectedOption: string | null;
    isAnswered: boolean;
    focusedOptionIndex: number;
    onOptionSelect: (option: string) => void;
    onOptionFocus: (index: number) => void;
};

export default function ChoiceList({
    options,
    correctAnswer,
    selectedOption,
    isAnswered,
    focusedOptionIndex,
    onOptionSelect,
    onOptionFocus
}: ChoiceListProps) {
    return (
        <div className="grid grid-cols-1 gap-3">
            {options.map((option, idx) => {
                let styleClass = "border-gray-200 hover:border-gray-300 hover:bg-gray-50";

                if (isAnswered) {
                    const isCorrect = Array.isArray(correctAnswer)
                        ? correctAnswer.includes(option)
                        : option === correctAnswer;

                    if (isCorrect) {
                        styleClass = "bg-green-50 border-green-200 text-green-700";
                    } else if (option === selectedOption) {
                        styleClass = "bg-red-50 border-red-200 text-red-700";
                    } else {
                        styleClass = "opacity-50 border-gray-100";
                    }
                } else if (idx === focusedOptionIndex) {
                    styleClass = "border-blue-400 bg-blue-50 text-blue-800 shadow-md ring-2 ring-blue-100";
                }

                return (
                    <button
                        key={idx}
                        onClick={() => onOptionSelect(option)}
                        onMouseEnter={() => onOptionFocus(idx)}
                        disabled={isAnswered}
                        className={`w-full py-4 px-6 rounded-xl border text-left transition-all duration-200 text-lg font-medium ${styleClass}`}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
