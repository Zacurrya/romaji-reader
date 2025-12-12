import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const text = searchParams.get('text');

    if (!text) {
        return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    try {
        // Use MyMemory Translation API (Free tier, no key required for low volume)
        // Source: Japanese (ja), Target: English (en)
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en`
        );

        if (!response.ok) {
            return NextResponse.json({ error: 'Translation service failed' }, { status: response.status });
        }

        const data = await response.json();

        // MyMemory returns detailed matches, but responseData.translatedText is the best guess
        const translatedText = data.responseData?.translatedText || 'Translation unavailable';

        return NextResponse.json({ translation: translatedText });

    } catch (error) {
        console.error('Error fetching translation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
