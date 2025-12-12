"use client";
import { useState } from "react";
import { useEffect } from "react";
import { toKana } from "wanakana";
import { useRomajiInput } from "../../hooks/useRomajiInput";
import LiveCard from "../(main)/search/_components/LiveCard";
import SentenceBar from "../(main)/sentenceBar/_components/SentenceBar";
import TranslatedSentence from "../(main)/sentenceBar/_components/TranslatedSentence";
import SearchBar from "./_components/SearchBar";

export default function TranslatorPage() {
    const [input, setInput] = useState("");
    const [committedWords, setCommittedWords] = useState<string[]>([]);
    const [isValidInput, setIsValidInput] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);

    const { resetRomaji, setRomaji, processInput } = useRomajiInput();

    useEffect(() => {
        if (input === "") resetRomaji();
    }, [input, resetRomaji]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        processInput(e, input, setInput);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && input === '' && committedWords.length > 0) {
            e.preventDefault();
            const lastWord = committedWords[committedWords.length - 1];
            setCommittedWords((prev) => prev.slice(0, -1));
            setInput(lastWord);
            setRomaji(lastWord);
            return;
        }

        if ((e.key === 'Enter' || e.key === ' ') && input.trim()) {
            e.preventDefault();

            if (!isValidInput) {
                // Trigger Flash
                setIsFlashing(true);
                setTimeout(() => setIsFlashing(false), 300);
                return;
            }

            // Finalize conversion (e.g. 'n' -> 'ん')
            const finalWord = toKana(input);
            setCommittedWords((prev) => [...prev, finalWord]);
            setInput("");
            setIsValidInput(false); // Reset validity until new input check
        }
    };

    const handleWordSelect = (selectedWord: string) => {
        // Commit selected word directly
        setCommittedWords((prev) => [...prev, selectedWord]);
        setInput("");
        setIsValidInput(false);
    };

    return (
        <div className="h-screen overflow-hidden relative">
            <main className="w-full h-full flex flex-col items-center justify-center bg-[#FAFAFA]">

                {/* Container for Centered Content */}
                <div className="pt-60 flex flex-col items-center justify-center mb-70">

                    {/* Sentence Bar */}
                    <SentenceBar words={committedWords} />
                    <TranslatedSentence words={committedWords} />

                    {/* LiveCard */}
                    <div className="mb-6 animate-in fade-in zoom-in duration-700">
                        <LiveCard
                            input={input}
                            context={committedWords}
                            onValidationChange={setIsValidInput}
                            onWordSelect={handleWordSelect}
                        />
                    </div>

                    {/* Search Bar - Extracted Component */}
                    <SearchBar
                        input={input}
                        handleChange={handleChange}
                        handleKeyDown={handleKeyDown}
                        isFlashing={isFlashing}
                    />
                </div>
            </main>
        </div>
    );
}
