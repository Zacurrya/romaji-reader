import { NextRequest, NextResponse } from 'next/server';
import JishoAPI from 'unofficial-jisho-api';
// @ts-ignore - kuromoji has some type issues or missing types in some envs
import kuromoji from 'kuromoji';
import { toRomaji } from 'wanakana';
import { getParticleInfo } from '@/utils/particles';

const jisho = new JishoAPI();

// Singleton tokenizer to avoid rebuilding usage
let tokenizer: any = null;

const getTokenizer = (): Promise<any> => {
    if (tokenizer) return Promise.resolve(tokenizer);

    return new Promise((resolve, reject) => {
        kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err: any, _tokenizer: any) => {
            if (err) reject(err);
            else {
                tokenizer = _tokenizer;
                resolve(tokenizer);
            }
        });
    });
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const romaji = searchParams.get('romaji');
    const contextJson = searchParams.get('context');

    if (!romaji) {
        return NextResponse.json({ error: 'Romaji parameter is required' }, { status: 400 });
    }

    try {
        const currentRomaji = toRomaji(romaji); // Convert "わ" -> "wa", "に" -> "ni"

        // 1. Analyze Context with Kuromoji (if context exists)
        let isConfirmedParticle = false;
        let confirmedKana = romaji; // Start with input, change if we auto-correct (e.g. わ -> は)

        // Mapping for implicit particles: User types 'wa' (わ) but means 'ha' (は)
        const PARTICLE_VARIANTS: Record<string, string> = {
            'わ': 'は',
            'お': 'を',
            'え': 'へ'
        };

        if (contextJson) {
            try {
                const context = JSON.parse(contextJson);
                // We only run context analysis if we actually HAVE context or the word itself might be a particle
                if (Array.isArray(context)) {
                    // FIX: Only treat as confirmed particle if we have context (preceding words)
                    if (context.length > 0) {
                        const myTokenizer = await getTokenizer();

                        // Check 1: As Typed (e.g. "学校に")
                        let fullSentence = context.join("") + romaji;
                        let tokens = myTokenizer.tokenize(fullSentence);

                        let found = false;
                        if (tokens.length > 0) {
                            const lastToken = tokens[tokens.length - 1];
                            if (lastToken.pos === '助詞' && lastToken.surface === romaji) {
                                isConfirmedParticle = true;
                                found = true;
                            }
                        }

                        // Check 2: Auto-Correct (e.g. "学校わ" -> "学校は")
                        if (!found && PARTICLE_VARIANTS[romaji]) {
                            const variant = PARTICLE_VARIANTS[romaji];
                            fullSentence = context.join("") + variant;
                            tokens = myTokenizer.tokenize(fullSentence);

                            if (tokens.length > 0) {
                                const lastToken = tokens[tokens.length - 1];
                                if (lastToken.pos === '助詞' && lastToken.surface === variant) {
                                    isConfirmedParticle = true;
                                    confirmedKana = variant; // Use "は" instead of "わ"
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Context analysis failed:", e);
                // Fallback to standard Jisho search
            }
        }

        // 2. If Context says it's a particle, return particle definition directly
        if (isConfirmedParticle) {
            const particleInfo = getParticleInfo(currentRomaji);
            if (particleInfo) {
                return NextResponse.json({
                    total: 1,
                    words: [{
                        word: particleInfo.particle.split(' ')[0], // "は"
                        furigana: confirmedKana,
                        romaji: currentRomaji,
                        meaning: particleInfo.definition // "Topic Marker..."
                    }]
                });
            }
        }

        // 3. Standard Jisho Search (Fallback)
        const result = await jisho.searchForPhrase(romaji);

        // Deduplicate and filter for exact matches
        // romaji variable holds the Kana input (e.g. "くも")
        const exactMatches = result.data.filter((entry: any) => {
            // Check if any of the Japanese forms match the input exactly
            return entry.japanese.some((j: any) =>
                j.reading === romaji || j.word === romaji
            );
        });

        // Use exact matches if found, otherwise (if stiff strictness is too high?) 
        // User requested "only words with the exact same spellings".
        // If exact matches exist, use them. If 0, maybe fallback? 
        // "only words with the exact same spellings should appear". 
        // Implies strict filtering.

        const finalResults = exactMatches.length > 0 ? exactMatches : [];

        const words = finalResults.slice(0, 10).map((entry: any) => {
            const firstJapanese = entry.japanese[0] || {};

            // Find the specific Japanese entry that matched if possible, but usually first is fine or main.
            // Actually, we should probably pick the definition for the match.
            // But simplification: Map as before.

            const firstSense = entry.senses[0] || {};

            return {
                word: firstJapanese.word || firstJapanese.reading || '',
                furigana: firstJapanese.reading || '',
                romaji: romaji,
                meaning: firstSense.english_definitions?.join(', ') || 'No definition'
            };
        });

        return NextResponse.json({
            total: words.length,
            words: words
        });

    } catch (error) {
        console.error('Error fetching word meaning:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
