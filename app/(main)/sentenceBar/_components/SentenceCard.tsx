"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toRomaji } from "wanakana";
import { isParticle, getParticleInfo } from "@/utils/particles";
import { getCachedWord, setCachedWord } from "@/utils/wordCache";
import Tooltip from "../../components/ui/Tooltip";

type SentenceCardProps = {
    input: string;
    context: string[];
};

type CardData = {
    meaning: string;
    kana: string; // The word in Kana/Kanji
    subText: string;
    imageUrl: string;
    loading: boolean;
};

const SentenceCard = ({ input, context }: SentenceCardProps) => {
    const [data, setData] = useState<CardData>({
        meaning: "",
        kana: input,
        subText: "",
        imageUrl: "",
        loading: true,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            // Check Cache First
            const cached = getCachedWord(input);
            if (cached) {
                if (isMounted) {
                    setData({
                        meaning: cached.meaning,
                        kana: cached.kana,
                        subText: cached.subText,
                        imageUrl: cached.imageUrl,
                        loading: false
                    });
                }
                return;
            }

            const romaji = toRomaji(input);
            const isGrammarParticle = isParticle(romaji);

            let newMeaning = "";
            let newKana = input; // Default to input
            let newSubText = "";
            let newImageUrl = "";

            try {
                // 1. Fetch Meaning
                const meanRes = await fetch(`/api/word-meaning?romaji=${encodeURIComponent(input)}&context=${encodeURIComponent(JSON.stringify(context))}`);
                if (meanRes.ok) {
                    const json = await meanRes.json();
                    if (json.words && json.words.length > 0) {
                        newMeaning = json.words[0].meaning.split(',')[0].trim().toUpperCase();
                        newKana = json.words[0].word || json.words[0].furigana || input;
                        const furigana = json.words[0].furigana;
                        newSubText = (!furigana || furigana === newKana)
                            ? `/ ${input} /`
                            : `/ ${furigana} /`;
                    } else {
                        newSubText = `/ ${input} /`;
                    }
                } else {
                    newSubText = `/ ${input} /`;
                }

                // 2. Fetch Image (if not particle and has meaning)
                if (newMeaning && !isGrammarParticle) {
                    const searchTerm = newMeaning.split(',')[0].trim();
                    try {
                        const imageRes = await fetch(`/api/image?query=${encodeURIComponent(searchTerm)}`);
                        if (imageRes.ok) {
                            const imgJson = await imageRes.json();
                            newImageUrl = imgJson.imageUrl || "";
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            } catch (e) {
                console.error(e);
            }

            if (isMounted) {
                // Cache It
                setCachedWord(input, {
                    meaning: newMeaning,
                    kana: newKana,
                    subText: newSubText,
                    imageUrl: newImageUrl
                });

                setData({
                    meaning: newMeaning,
                    kana: newKana,
                    subText: newSubText,
                    imageUrl: newImageUrl,
                    loading: false
                });
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [input, context]);

    const romajiCheck = toRomaji(input);
    const isGrammarParticle = isParticle(romajiCheck);
    const particleInfo = isGrammarParticle ? getParticleInfo(romajiCheck) : null;

    // Determine Tooltip Props
    let tooltipProps = null;

    if (isGrammarParticle && particleInfo) {
        tooltipProps = {
            character: particleInfo.particle.split(" ")[0],
            type: "Particle",
            definition: particleInfo.definition,
            info: particleInfo.structure
        };
    } else if (!isGrammarParticle && data.meaning) {
        tooltipProps = {
            character: data.kana,
            type: "Word", // We could infer POS if we had it, for now "Word" is fine or maybe "Noun" etc if API provided it.
            definition: data.meaning,
            // info could be reading
            info: data.subText ? data.subText.replace(/\//g, '').trim() : undefined
        };
    }

    return (
        <div className="group relative flex flex-col items-center animate-in fade-in zoom-in duration-300">
            {/* Tooltip for All Words */}
            {tooltipProps && (
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 -top-2 -translate-y-full left-1/2 -translate-x-1/2 w-max pointer-events-none">
                    <Tooltip {...tooltipProps} />
                </div>
            )}

            {/* Image Container - Height fixed at 100px for alignment, Width variable for spacing. Particles aligned to bottom. */}
            <div className={`relative overflow-hidden rounded-2xl transition-transform duration-300 group-hover:-translate-y-1 h-[100px] flex ${isGrammarParticle ? 'items-end pb-2' : 'items-center'} justify-center ${isGrammarParticle ? 'w-[40px] shadow-none bg-transparent' : 'w-[100px] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.1)] bg-white'}`}>
                {data.imageUrl ? (
                    <Image
                        src={data.imageUrl}
                        alt={data.meaning}
                        width={100}
                        height={100}
                        className={`object-cover w-full h-full transition-opacity duration-500 ${data.loading ? 'opacity-50' : 'opacity-100'}`}
                        unoptimized
                    />
                ) : (
                    // Placeholder / Particle View
                    <div className={`flex items-center justify-center ${isGrammarParticle ? 'w-[40px] h-[40px] border border-dashed border-gray-400/50 rounded-full' : 'w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100'}`}>
                        {data.loading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                        ) : (
                            <span className="text-[10px] text-gray-400 font-sans uppercase tracking-widest">
                                {isGrammarParticle ? '' : ''}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Typography Stack (LiveCard Style) */}
            <div className="flex flex-col items-center mt-3 space-y-0.5">
                {/* Reading */}
                {/* Reading (Invisible for particles to preserve height alignment) */}
                <p className={`text-[0.9rem] text-muted-foreground/80 tracking-wider text-center ${isGrammarParticle ? 'invisible' : ''}`}>
                    {data.subText || '\u00A0'}
                </p>

                {/* Kanji */}
                <h1 className={`font-serif font-semibold text-gray-900 tracking-tight text-center leading-tight ${isGrammarParticle ? 'text-xl text-gray-500' : 'text-xl'}`}>
                    {data.kana}
                </h1>

                {/* Meaning (Hidden for particles/empty) */}
                {data.meaning && !isGrammarParticle && (
                    <h2 className="text-[0.8rem] text-muted-foreground font-serif font-light tracking-widest uppercase text-center max-w-[100px] truncate px-1">
                        {data.meaning}
                    </h2>
                )}

            </div>
        </div>
    );
};

export default SentenceCard;
