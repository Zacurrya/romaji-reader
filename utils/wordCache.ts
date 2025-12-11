type CachedWordData = {
    meaning: string;
    kana: string;
    subText: string;
    imageUrl: string;
};

const wordCache = new Map<string, CachedWordData>();

export const getCachedWord = (term: string): CachedWordData | undefined => {
    return wordCache.get(term.toLowerCase());
};

export const setCachedWord = (term: string, data: CachedWordData): void => {
    wordCache.set(term.toLowerCase(), data);
};

export const hasCachedWord = (term: string): boolean => {
    return wordCache.has(term.toLowerCase());
};
