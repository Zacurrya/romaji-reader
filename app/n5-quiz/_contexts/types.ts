export type QuestionType =
    | "KANA_TO_KANJI_INPUT"    // What is the kana for this kanji (User types reading)
    | "KANA_TO_KANJI_CHOICE"   // Choose the correct kanji for this kana
    | "TRANSLATION_CHOICE"     // Multichoice translation
    | "TRANSLATION_INPUT";     // Type the translation (EN -> JP)

export type Question = {
    id: number;
    question: string;
    options?: string[];
    correctAnswer: string | string[]; // Can be multiple valid answers for input
    type: QuestionType;
};
