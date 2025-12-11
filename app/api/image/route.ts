import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
        console.error('UNSPLASH_ACCESS_KEY is not defined');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish`,
            {
                headers: {
                    Authorization: `Client-ID ${accessKey}`
                }
            }
        );

        if (!response.ok) {
            // Fallback or error
            return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
        }

        const data = await response.json();
        const imageUrl = data.results[0]?.urls?.small || '';

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error('Error fetching image:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
