"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toRomaji } from "wanakana";
import { isParticle } from "@/utils/particles";
import { getCachedWord, setCachedWord } from "@/utils/wordCache";

type LiveCardProps = {
    input: string;
    onValidationChange?: (isValid: boolean) => void;
};

type CardData = {
    mainText: string;
    meaning: string;
    subText: string;
    imageUrl: string;
    loading: boolean;
};

const LiveCard = ({ input, onValidationChange }: LiveCardProps) => {
    const [data, setData] = useState<CardData>({
        mainText: "",
        meaning: "WAITING...",
        subText: "/ ... /",
        imageUrl: "",
        loading: false,
    });

    useEffect(() => {
        if (!input) {
            setData({
                mainText: "",
                meaning: "",
                subText: "",
                imageUrl: "",
                loading: false
            });
            return;
        }

        const fetchData = async () => {
            // Check Cache First
            const cached = getCachedWord(input);
            if (cached) {
                setData({
                    mainText: cached.kana,
                    meaning: cached.meaning,
                    subText: cached.subText,
                    imageUrl: cached.imageUrl,
                    loading: false
                });

                // Validate from cache
                const currentRomaji = toRomaji(input);
                const isValid = !/[a-zA-Z]/.test(input) && (cached.meaning !== "NO DEFINITION" || isParticle(currentRomaji));
                if (onValidationChange) onValidationChange(isValid);
                return;
            }

            setData((prev) => ({ ...prev, loading: true }));

            const currentRomaji = toRomaji(input);

            try {
                // 1. Fetch Meaning & Japanese Word
                const meanRes = await fetch(`/api/word-meaning?romaji=${encodeURIComponent(input)}`);

                let newMeaning = "NO DEFINITION";
                let newMainText = input; // Default to input (Kana)
                let newReading = input;
                let newImageUrl = "";

                if (meanRes.ok) {
                    const json = await meanRes.json();
                    if (json.words && json.words.length > 0) {
                        newMeaning = json.words[0].meaning.toUpperCase();
                        newMainText = json.words[0].word || json.words[0].furigana || input;
                        newReading = json.words[0].furigana || input;
                    }
                }

                // Determine Validity
                const isValid = !/[a-zA-Z]/.test(input) && (newMeaning !== "NO DEFINITION" || isParticle(currentRomaji));
                if (onValidationChange) onValidationChange(isValid);

                // 2. Fetch Image (if meaning exists & not particle)
                if (newMeaning !== "NO DEFINITION" && !isParticle(currentRomaji)) {
                    // Clean up meaning for search (remove commas, take first word)
                    const searchTerm = newMeaning.split(',')[0].trim();

                    try {
                        const imgRes = await fetch(`/api/image?query=${encodeURIComponent(searchTerm)}`);
                        if (imgRes.ok) {
                            const imgJson = await imgRes.json();
                            newImageUrl = imgJson.imageUrl;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }

                const finalData = {
                    mainText: newMainText,
                    meaning: newMeaning,
                    subText: `/ ${newReading} /`,
                    imageUrl: newImageUrl,
                    loading: false
                };

                // Cache the result for future use
                setCachedWord(input, {
                    meaning: newMeaning,
                    kana: newMainText,
                    subText: `/ ${newReading} /`,
                    imageUrl: newImageUrl
                });

                setData(finalData);

            } catch (e) {
                console.error(e);
                setData((prev) => ({ ...prev, loading: false, meaning: "ERROR" }));
            }
        };

        const timer = setTimeout(fetchData, 400);
        return () => clearTimeout(timer);

    }, [input]);

    return (
        <div className="pt-10 pb-5 flex flex-col items-center justify-center animate-in fade-in duration-500 w-full">
            {/* Image Card */}
            <div className="relative w-60 h-60 mb-6 bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] flex items-center justify-center overflow-hidden">
                {data.imageUrl ? (
                    <div className="relative w-full h-full p-6">
                        <Image
                            src={data.imageUrl}
                            alt="Visualization"
                            fill
                            className={`object-cover rounded-[1.5rem] transition-opacity duration-700 ${data.loading ? 'opacity-50 blur-sm' : 'opacity-100'}`}
                            unoptimized
                        />
                    </div>
                ) : (
                    // Empty / Loading State
                    <div className={`w-32 h-3/4 rounded-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center ${data.loading ? 'animate-pulse' : 'opacity-0'}`}>
                    </div>
                )}
            </div>

            {/* Typography */}
            <h1 className="text-5xl mb-3 font-serif font-medium text-gray-900 tracking-tight text-center">
                {data.mainText || input}
            </h1>

            <h2 className="text-xl text-muted-foreground font-serif font-light tracking-[0.2em] uppercase mb-1 text-center">
                {data.meaning}
            </h2>

            <p className="text-sm text-muted-foreground font-sans tracking-wider text-center">
                {data.subText}
            </p>

        </div>
    );
};

export default LiveCard;
