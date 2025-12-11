import { NextRequest, NextResponse } from 'next/server';
import JishoAPI from 'unofficial-jisho-api';

const jisho = new JishoAPI();

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const romaji = searchParams.get('romaji');

    if (!romaji) {
        return NextResponse.json({ error: 'Romaji parameter is required' }, { status: 400 });
    }

    try {
        // Use unofficial-jisho-api to search
        const result = await jisho.searchForPhrase(romaji);

        // Convert Jisho format to our format
        const words = result.data.slice(0, 5).map((entry: any) => {
            const firstJapanese = entry.japanese[0] || {};
            const firstSense = entry.senses[0] || {};

            return {
                word: firstJapanese.word || firstJapanese.reading || '', // Fallback to reading if no kanji word
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
