"use client";
import { useState, useEffect } from "react";
import { toKana } from "wanakana";

type QuizInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    autoFocus?: boolean;
    placeholder?: string;
};

export default function QuizInput({ value, onChange, onSubmit, disabled, autoFocus, placeholder = "Type answer..." }: QuizInputProps) {
    const [romaji, setRomaji] = useState("");

    // Reset romaji when value is cleared externally (e.g. new question)
    useEffect(() => {
        if (value === "") setRomaji("");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputType = (e.nativeEvent as any).inputType;
        const data = (e.nativeEvent as any).data;
        let newRomaji = romaji;

        if (inputType === "insertText" && data) {
            newRomaji += data;
        } else if (inputType === "deleteContentBackward") {
            newRomaji = newRomaji.slice(0, -1);
        } else if (!e.target.value) {
            // Clear all
            newRomaji = "";
        } else {
            // Complex edit (paste, etc) - simple fallback: try to use the current value as best effort or reset
            // For N5 quiz, preventing cheating via paste is fine, or just not supporting it perfectly.
            // Let's just assume reset if unclear to avoid stuck state.
            // Or better: don't update romaji, but update value? No, we drive value from romaji.
            // If we reset romaji, the input clears.
            // Let's try to map the new value back? hard.
            // We'll just leave it be if it's not a standard type/delete.
        }

        setRomaji(newRomaji);
        const kana = toKana(newRomaji);
        onChange(kana);
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
                    className="flex-1 h-full bg-transparent text-2xl text-gray-800 font-medium font-sans outline-none placeholder:text-gray-300 text-center"
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    autoComplete="off"
                />
            </div>
        </div>
    );
}
