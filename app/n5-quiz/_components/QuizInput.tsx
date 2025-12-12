"use client";

import { useEffect } from "react";
import { useRomajiInput } from "../../../hooks/useRomajiInput";

type QuizInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    autoFocus?: boolean;
    placeholder?: string;
};

export default function QuizInput({ value, onChange, onSubmit, disabled, autoFocus, placeholder = "Type answer..." }: QuizInputProps) {
    const { resetRomaji, processInput } = useRomajiInput();

    // Reset romaji when value is cleared externally (e.g. new question)
    useEffect(() => {
        if (value === "") resetRomaji();
    }, [value, resetRomaji]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        processInput(e, value, onChange);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            onSubmit();
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto mb-8">
            <div className={`relative w-full h-16 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center px-6 transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}>
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    className="flex-1 h-full bg-transparent text-2xl text-gray-800 font-medium outline-none placeholder:text-gray-300 text-center"
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    autoComplete="off"
                />
            </div>
        </div>
    );
}
