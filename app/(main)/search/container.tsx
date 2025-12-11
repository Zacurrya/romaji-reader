"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type WordMeaning = {
    word: string;
    furigana: string;
    romaji: string;
    meaning: string;
    level: number;
};

type TranslationBoxContainerProps = {
    romaji: string;
};

const TranslationBoxContainer = ({ romaji }: TranslationBoxContainerProps) => {
    const [meanings, setMeanings] = useState<WordMeaning[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!romaji.trim()) {
            setMeanings([]);
            return;
        }

        const fetchMeanings = async () => {
            setLoading(true);
            setError(null);

            try {
                // Split romaji into individual words
                const words = romaji.trim().split(/\s+/);

                // Fetch meanings for each word
                const fetchPromises = words.map(async (word) => {
                    const response = await fetch(`/api/word-meaning?romaji=${encodeURIComponent(word)}`);

                    if (!response.ok) {
                        return [];
                    }

                    const data = await response.json();
                    return data.words && Array.isArray(data.words) ? data.words : [];
                });

                // Wait for all fetches to complete
                const allResults = await Promise.all(fetchPromises);

                // Flatten the results and remove duplicates
                const allMeanings = allResults.flat();

                // Remove duplicate words (based on word + romaji combination)
                const uniqueMeanings = allMeanings.filter((meaning, index, self) =>
                    index === self.findIndex((m) => m.word === meaning.word && m.romaji === meaning.romaji)
                );

                setMeanings(uniqueMeanings);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setMeanings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMeanings();
    }, [romaji]);

    if (!romaji.trim()) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            {loading && (
                <div className="p-4 border-2 border-[foreground] rounded-lg bg-background text-center">
                    Loading meanings...
                </div>
            )}

            {error && (
                <div className="p-4 border-2 border-red-500 rounded-lg bg-red-50 text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && meanings.length === 0 && (
                <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-center">
                    No meanings found for "{romaji}"
                </div>
            )}

            {!loading && !error && meanings.length > 0 && (
                <div className="space-y-4">
                    {meanings.map((meaning, index) => (
                        <div
                            key={index}
                            className="p-4 border-2 border-[foreground] rounded-lg bg-background flex justify-between items-center gap-4"
                        >
                            <div className="flex-1">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <h3 className="text-3xl font-bold">{meaning.word || meaning.furigana}</h3>
                                    {meaning.furigana && meaning.word && (
                                        <span className="text-xl text-gray-600">{meaning.furigana}</span>
                                    )}
                                </div>

                                <p className="text-lg mb-1">
                                    <span className="font-semibold">Romaji:</span> {meaning.romaji}
                                </p>

                                <p className="text-lg mb-1">
                                    <span className="font-semibold">Meaning:</span> {meaning.meaning}
                                </p>

                                {meaning.level && (
                                    <p className="text-sm text-gray-600">
                                        JLPT Level: N{meaning.level}
                                    </p>
                                )}
                            </div>

                            <div className="flex-shrink-0">
                                <Image
                                    src={`https://source.unsplash.com/150x150/?${encodeURIComponent(meaning.meaning)}`}
                                    alt={meaning.meaning}
                                    width={150}
                                    height={150}
                                    className="rounded-lg object-cover"
                                    unoptimized
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TranslationBoxContainer;