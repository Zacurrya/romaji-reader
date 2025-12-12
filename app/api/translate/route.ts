import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const text = searchParams.get('text');

    if (!text) {
        return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    try {
        // Use Google Translate GTX API (Unofficial, reliable, high quality)
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURIComponent(text)}`
        );

        if (!response.ok) {
            return NextResponse.json({ error: 'Translation service failed' }, { status: response.status });
        }

        const data = await response.json();

        // GTX returns: [[["Translated Text", "Original", ...], ...], ...]
        // We join parts if multiple segments
        const translatedText = data[0]
            .map((segment: any) => segment[0])
            .join('');

        return NextResponse.json({ translation: translatedText });

    } catch (error) {
        console.error('Error fetching translation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
