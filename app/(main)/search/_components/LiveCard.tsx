"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toRomaji } from "wanakana";
import { isParticle, getParticleInfo } from "@/utils/particles";
import { getCachedWord, setCachedWord } from "@/utils/wordCache";

type LiveCardProps = {
    input: string;
    context: string[];
    onValidationChange?: (isValid: boolean) => void;
    onWordSelect?: (selectedWord: string) => void;
};

type CardData = {
    mainText: string;
    meaning: string;
    subText: string;
    imageUrl: string;
    loading: boolean;
};

const LiveCard = ({ input, context, onValidationChange, onWordSelect }: LiveCardProps) => {
    // Store array of options for multiple meanings
    const [options, setOptions] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!input) {
            setOptions([]);
            return;
        }

        const fetchData = async () => {
            // For multiple results, we might skip cache or modify cache structure. 
            // To simplify given complexity: We always fetch to get all meanings if cache only stores one.
            // BUT, if we want to be fast, we stick to fetching.
            // Rate limit concern: MyMemory and Unsplash. 
            // Let's rely on API.

            setLoading(true);

            const currentRomaji = toRomaji(input);

            try {
                // 1. Fetch Meanings & Words
                const meanRes = await fetch(`/api/word-meaning?romaji=${encodeURIComponent(input)}&context=${encodeURIComponent(JSON.stringify(context))}`);

                let results: CardData[] = [];

                if (meanRes.ok) {
                    const json = await meanRes.json();
                    if (json.words && json.words.length > 0) {
                        // Take up to 3 results
                        const candidates = json.words.slice(0, 3);

                        // We need ONE image search for the PRIMARY meaning likely, or per meaning.
                        // To avoid spamming Unsplash, we'll fetch only for the first one for now or just generic background.
                        // Actually, user wants distinct cards. They should ideally have distinct images.
                        // Let's do it right: Fetch image for each.

                        const promises = candidates.map(async (entry: any) => {
                            const meaning = entry.meaning?.toUpperCase() || "NO DEFINITION";
                            const mainText = entry.word || entry.furigana || input;
                            const reading = entry.furigana || input;
                            const subText = `/ ${reading} /`;

                            let imageUrl = "";

                            if (meaning !== "NO DEFINITION" && !isParticle(currentRomaji)) {
                                const searchTerm = meaning.split(',')[0].trim();
                                // Basic cleanup
                                try {
                                    // Add random param to prevent identical image if meanings essentially same? No, browser cache will handle repeated requests.
                                    // Actually we will benefit from Promise.all
                                    const imgRes = await fetch(`/api/image?query=${encodeURIComponent(searchTerm)}`);
                                    if (imgRes.ok) {
                                        const imgJson = await imgRes.json();
                                        imageUrl = imgJson.imageUrl;
                                    }
                                } catch (e) { console.error(e); }
                            }

                            return {
                                mainText,
                                meaning,
                                subText,
                                imageUrl,
                                loading: false
                            };
                        });

                        results = await Promise.all(promises);

                        // Inject Particle Option if applicable
                        const particleInfo = getParticleInfo(currentRomaji);
                        if (particleInfo) {
                            const particleChar = particleInfo.particle.split(' ')[0];
                            const cleanDefinition = particleInfo.definition;

                            // Filter out existing particle-like results to avoid duplicates
                            results = results.filter(r => r.mainText !== particleChar && r.meaning !== cleanDefinition);

                            // Prepend the clean particle option
                            results.unshift({
                                mainText: particleChar,
                                meaning: cleanDefinition,
                                subText: `/ ${input} /`,
                                imageUrl: "",
                                loading: false
                            });
                        }
                    }
                }

                // Fallback if empty (e.g. typing nonsense)
                if (results.length === 0) {
                    results = [{
                        mainText: input,
                        meaning: "WORD DOESN'T EXIST",
                        subText: `/ ${input} /`,
                        imageUrl: "",
                        loading: false
                    }];
                }

                setOptions(results);

                // Validate (based on at least one valid result)
                const hasValid = results.some(r => r.meaning !== "WORD DOESN'T EXIST" && r.meaning !== "NO DEFINITION");
                const isValid = !/[a-zA-Z]/.test(input) && (hasValid || isParticle(currentRomaji));
                if (onValidationChange) onValidationChange(isValid);

            } catch (e) {
                console.error(e);
                setOptions([]); // Should show error state
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchData, 500); // 500ms debounce
        return () => clearTimeout(timer);

    }, [input, context]);

    if (!input) return null;

    // Determine layout: Single generic card vs Multiple options
    // If loading, show skeleton.

    return (
        <div className="pt-10 pb-5 w-full">
            <div className={`flex flex-wrap items-center justify-center gap-6 transition-all duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>

                {options.map((option, idx) => {
                    const isMultiple = options.length > 1;
                    return (
                        <div
                            key={idx}
                            onClick={() => onWordSelect && onWordSelect(option.mainText)}
                            className="group cursor-pointer flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 fill-mode-backwards"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Image Card */}
                            <div className={`relative w-48 h-48 mb-4 bg-white rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center justify-center overflow-hidden border border-transparent ${isMultiple ? 'group-hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] group-hover:-translate-y-1 group-hover:border-gray-100' : ''
                                }`}>
                                {option.imageUrl ? (
                                    <div className="relative w-full h-full p-4">
                                        <Image
                                            src={option.imageUrl}
                                            alt="Visualization"
                                            fill
                                            className={`object-cover rounded-[1.2rem]`}
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center`}>
                                        {/* Empty logic */}
                                    </div>
                                )}

                                {/* Hover Overlay indicating 'Pick' */}
                                {isMultiple && (
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            PICK
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Typography */}
                            <p className="text-xs text-muted-foreground tracking-wider text-center">
                                {option.subText}
                            </p>

                            <h1 className="text-3xl mb-2 font-serif font-medium text-gray-900 tracking-tight text-center">
                                {option.mainText}
                            </h1>

                            <h2 className="text-sm text-muted-foreground font-serif font-light tracking-[0.1em] uppercase mb-1 text-center max-w-[200px] truncate">
                                {option.meaning}
                            </h2>
                        </div>
                    )
                })}

                {/* Loading State Skeleton (if initial load) */}
                {options.length === 0 && loading && (
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-48 h-48 bg-gray-100 rounded-[2rem] mb-4"></div>
                        <div className="w-20 h-4 bg-gray-100 rounded mb-2"></div>
                        <div className="w-32 h-8 bg-gray-100 rounded"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveCard;
