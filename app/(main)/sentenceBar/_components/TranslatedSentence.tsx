"use client";
import { useEffect, useState } from "react";

type TranslatedSentenceProps = {
    words: string[];
};

export default function TranslatedSentence({ words }: TranslatedSentenceProps) {
    const [translation, setTranslation] = useState("");
    const [loading, setLoading] = useState(false);

    const fullSentence = words.join("");

    useEffect(() => {
        if (!fullSentence) {
            setTranslation("");
            return;
        }

        const fetchTranslation = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/translate?text=${encodeURIComponent(fullSentence)}`);
                if (res.ok) {
                    const data = await res.json();
                    setTranslation(data.translation);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        // Debounce slightly to avoid hammering API while typing/deleting fast
        const timer = setTimeout(fetchTranslation, 800);
        return () => clearTimeout(timer);

    }, [fullSentence]);

    if (words.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block px-10 py-5 rounded-2xl bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col items-center">

                {/* Japanese Original */}
                <p className="font-serif text-3xl text-gray-900 tracking-wide mb-2">
                    {fullSentence}
                </p>

                {/* English Translation */}
                <div className="h-6 flex items-center justify-center">
                    {loading ? (
                        <div className="w-20 h-2 bg-gray-100 rounded-full animate-pulse"></div>
                    ) : (
                        <p className="text-sm text-muted-foreground font-sans font-medium tracking-widest uppercase animate-in fade-in duration-500">
                            {translation}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
