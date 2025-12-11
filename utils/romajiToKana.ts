import { toKana } from 'wanakana';

export function romajiToKana(romaji: string): string {
    if (!romaji) return '';
    return toKana(romaji);
}
