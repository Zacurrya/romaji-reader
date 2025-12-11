"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { romajiToKana } from "@/utils/romajiToKana";
import { isParticle } from "@/utils/particles";
import { toRomaji } from "wanakana";

type SentenceDisplayProps = {
    wordList: string[];
};

type WordWithMeaning = {
    romaji: string;
    meaning: string;
    kana: string;
    imageUrl?: string;
};

const SentenceDisplay = ({ wordList }: SentenceDisplayProps) => {
    const [words, setWords] = useState<WordWithMeaning[]>([]);

    useEffect(() => {
        if (wordList.length === 0) {
            setWords([]);
            return;
        }

        const fetchAllData = async () => {
            const results = await Promise.all(
                wordList.map(async (textInput) => {
                    let wordData: WordWithMeaning = { romaji: textInput, meaning: "", kana: "", imageUrl: "" };

                    // Convert to Romaji for particle check (since input might be Kana)
                    const checkRomaji = toRomaji(textInput);
                    const isGrammarParticle = isParticle(checkRomaji);

                    try {
                        // 1. Fetch Meaning
                        const meaningRes = await fetch(`/api/word-meaning?romaji=${encodeURIComponent(wordData.romaji)}`);
                        if (meaningRes.ok) {
                            const data = await meaningRes.json();
                            if (data.words && data.words.length > 0) {
                                wordData.meaning = data.words[0].meaning;
                                wordData.kana = data.words[0].furigana || data.words[0].word;
                            }
                        }

                        // 2. Fetch Image (SKIP if particle)
                        if (wordData.meaning && !isGrammarParticle) {
                            // Extract the first meaningful word for better image search if multiple meanings exist
                            // e.g. "black, dark" -> "black"
                            const searchTerm = wordData.meaning.split(',')[0].trim();
                            try {
                                const imageRes = await fetch(`/api/image?query=${encodeURIComponent(searchTerm)}`);
                                if (imageRes.ok) {
                                    const imageData = await imageRes.json();
                                    wordData.imageUrl = imageData.imageUrl || "";
                                }
                            } catch (e) {
                                console.error("Failed to fetch image", e);
                            }
                        }

                    } catch (e) {
                        console.error("Failed to fetch word data", e);
                    }

                    return wordData;
                })
            );
            setWords(results);
        };

        fetchAllData();
    }, [wordList]);

    if (wordList.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto mb-12 p-8 rounded-xl bg-white/50 border border-primary/10 shadow-sm backdrop-blur-sm">
            <div className="flex flex-wrap gap-8 justify-center">
                {words.map((word, index) => {
                    const isGrammarParticle = isParticle(toRomaji(word.romaji));
                    return (
                        <div key={index} className="group relative flex flex-col items-center">

                            {/* Hove-only English Translation Tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max max-w-[200px] px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                {word.meaning || "?"}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45"></div>
                            </div>

                            {/* Image above */}
                            <div className={`relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:-translate-y-1 ${isGrammarParticle ? 'shadow-none bg-transparent' : ''}`}>
                                {word.imageUrl ? (
                                    <Image
                                        src={word.imageUrl}
                                        alt={word.meaning}
                                        width={120}
                                        height={120}
                                        className="object-cover w-[120px] h-[120px]"
                                        unoptimized
                                    />
                                ) : (
                                    <div className={`w-[120px] h-[120px] flex items-center justify-center ${isGrammarParticle ? 'bg-transparent border-2 border-dashed border-primary/20 rounded-full w-[80px] h-[80px] my-[20px]' : 'bg-muted/30'}`}>
                                        <span className={`text-xs font-serif ${isGrammarParticle ? 'text-primary/50 font-bold' : 'text-muted-foreground/40'}`}>
                                            {isGrammarParticle ? 'Particle' : 'No Image'}
                                        </span>
                                    </div>
                                )}

                                {/* Subtle overlay on hover (skip for particles) */}
                                {!isGrammarParticle && <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>}
                            </div>

                            {/* Kana - Always visible, larger */}
                            <span className="text-2xl font-bold font-serif mt-3 text-foreground tracking-wide">
                                {word.kana || romajiToKana(word.romaji)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SentenceDisplay;
