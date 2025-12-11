const imageCache = new Map<string, string>();

export const getCachedImage = (term: string): string | undefined => {
    return imageCache.get(term);
};

export const setCachedImage = (term: string, url: string): void => {
    imageCache.set(term, url);
};

export const hasCachedImage = (term: string): boolean => {
    return imageCache.has(term);
};
