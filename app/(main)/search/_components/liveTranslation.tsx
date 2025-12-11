"use client";
import { useEffect, useState } from "react";

type LiveTranslationProps = {
    romaji: string;
};

const LiveTranslation = ({ romaji }: LiveTranslationProps) => {
    const [meaning, setMeaning] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!romaji.trim()) {
            setMeaning("");
            return;
        }

        const fetchMeaning = async () => {
            setLoading(true);

            try {
                const strippedRomaji = romaji.replace(/\s+/g, '');
                const response = await fetch(`/api/word-meaning?romaji=${encodeURIComponent(strippedRomaji)}`);

                if (!response.ok) {
                    setMeaning("");
                    return;
                }

                const data = await response.json();

                if (data.words && data.words.length > 0) {
                    setMeaning(data.words[0].meaning);
                } else {
                    setMeaning("");
                }
            } catch (err) {
                setMeaning("");
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchMeaning, 300);
        return () => clearTimeout(debounceTimer);
    }, [romaji]);

    if (!romaji.trim()) return null;

    return (
        <div className="text-center mb-2">
            <p className="text-lg text-gray-600 italic">
                {loading ? "..." : meaning || "No translation found"}
            </p>
        </div>
    );
};

export default LiveTranslation;
