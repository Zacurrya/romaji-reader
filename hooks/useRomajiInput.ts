"use client";

import { useState, useCallback } from "react";
import { toKana } from "wanakana";

export function useRomajiInput(initialValue: string = "") {
    // We don't necessarily need to store 'romaji' state if we just want the processing logic.
    // However, QuizInput kept 'romaji' state to handle backspaces properly?
    // Actually, QuizInput logic:
    // 1. Listen to Change -> calculate newRomaji -> setRomaji -> convert -> onChange(kana).
    // The key is accumulating Romaji.

    // But for the SearchBar in translator, it was using `toKana(val, {IMEMode: true})`.
    // The user wants the QuizInput logic (Custom accumulation).

    const [romaji, setRomaji] = useState("");

    // We also need a way to RESET externally usually, or sync with value.
    // If 'value' is passed in props, we might need to reset 'romaji' if value is empty.

    const processInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, currentValue: string, onChange: (val: string) => void) => {
        const inputType = (e.nativeEvent as any).inputType;
        const data = (e.nativeEvent as any).data;

        let newRomaji = romaji; // This relies on closure state 'romaji'. 
        // NOTE: if hook is used, 'romaji' is state.

        // If the user clears the input manually (e.g. select all delete), 
        // e.target.value becomes empty.
        if (!e.target.value) {
            newRomaji = "";
        } else if (inputType === "insertText" && data) {
            newRomaji += data;
        } else if (inputType === "deleteContentBackward") {
            newRomaji = newRomaji.slice(0, -1);
        } else {
            // Fallback for paste or other events: 
            // Try to use the event value directly if possible or reset.
            // For strict Romaji input, maybe just reset if confused?
            // Or better: Assume the user pasted Romaji -> convert it.
            // But existing QuizInput logic didn't handle paste well (commented out).
            // We'll stick to basic.
            if (e.target.value.length < currentValue.length) {
                // Deletion of some sort
                newRomaji = newRomaji.slice(0, -(currentValue.length - e.target.value.length));
            } else {
                // Addition
                // This is hard to guess without raw data.
                // We'll just map raw value if it fails.
            }
        }

        setRomaji(newRomaji);
        const kana = toKana(newRomaji);
        onChange(kana);
        return kana;
    }, [romaji]);

    const resetRomaji = useCallback(() => {
        setRomaji("");
    }, []);

    return {
        romaji,
        setRomaji, // Expose if needed
        resetRomaji,
        processInput
    };
}
