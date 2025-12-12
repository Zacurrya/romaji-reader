import { Question } from "./types";

export const n5Questions: Question[] = [
    // --- KANA_TO_KANJI_INPUT (Reading) ---
    {
        id: 1,
        question: "学生",
        correctAnswer: ["がくせい"],
        type: "KANA_TO_KANJI_INPUT"
    },
    {
        id: 2,
        question: "学校",
        correctAnswer: ["がっこう"],
        type: "KANA_TO_KANJI_INPUT"
    },
    {
        id: 3,
        question: "先生",
        correctAnswer: ["せんせい"],
        type: "KANA_TO_KANJI_INPUT"
    },
    {
        id: 4,
        question: "人",
        correctAnswer: ["ひと"],
        type: "KANA_TO_KANJI_INPUT"
    },

    // --- KANA_TO_KANJI_CHOICE (Kanji Selection) ---
    {
        id: 5,
        question: "ねこ",
        options: ["猫", "犬", "鳥", "馬"],
        correctAnswer: "猫",
        type: "KANA_TO_KANJI_CHOICE"
    },
    {
        id: 6,
        question: "やま",
        options: ["川", "山", "田", "日"],
        correctAnswer: "山",
        type: "KANA_TO_KANJI_CHOICE"
    },
    {
        id: 7,
        question: "たべる",
        options: ["飲む", "食べる", "見る", "聞く"],
        correctAnswer: "食べる",
        type: "KANA_TO_KANJI_CHOICE"
    },
    {
        id: 8,
        question: "ほん",
        options: ["木", "本", "休", "体"],
        correctAnswer: "本",
        type: "KANA_TO_KANJI_CHOICE"
    },

    // --- TRANSLATION_CHOICE ---
    {
        id: 9,
        question: "Good Morning",
        options: ["おはよう", "こんにちは", "こんばんは", "さようなら"],
        correctAnswer: "おはよう",
        type: "TRANSLATION_CHOICE"
    },
    {
        id: 10,
        question: "Thank you",
        options: ["すみません", "ありがとう", "ごめんなさい", "はい"],
        correctAnswer: "ありがとう",
        type: "TRANSLATION_CHOICE"
    },
    {
        id: 11,
        question: "I understand",
        options: ["わかります", "しりません", "ちがいます", "そうです"],
        correctAnswer: "わかります",
        type: "TRANSLATION_CHOICE"
    },
    {
        id: 12,
        question: "Delicious",
        options: ["まずい", "おいしい", "たかい", "やすい"],
        correctAnswer: "おいしい",
        type: "TRANSLATION_CHOICE"
    },

    // --- TRANSLATION_INPUT (Sentence/Word) ---
    {
        id: 13,
        question: "Dog",
        correctAnswer: ["いぬ", "犬"],
        type: "TRANSLATION_INPUT"
    },
    {
        id: 14,
        question: "To drink",
        correctAnswer: ["のみます", "のむ", "飲む"],
        type: "TRANSLATION_INPUT"
    },
    {
        id: 15,
        question: "Book",
        correctAnswer: ["ほん", "本"],
        type: "TRANSLATION_INPUT"
    },
    {
        id: 16,
        question: "Japan",
        correctAnswer: ["にほん", "にっぽん", "日本"],
        type: "TRANSLATION_INPUT"
    },
    {
        id: 17,
        question: "Water",
        correctAnswer: ["みず", "水"],
        type: "TRANSLATION_INPUT"
    },
    {
        id: 18,
        question: "Friday",
        correctAnswer: ["きんようび", "金曜日"],
        type: "TRANSLATION_INPUT"
    },
    {
        id: 19,
        question: "Red",
        correctAnswer: ["あか", "赤"],
        type: "TRANSLATION_INPUT"
    },
    {
        id: 20,
        question: "Name",
        correctAnswer: ["なまえ", "名前"],
        type: "TRANSLATION_INPUT"
    }
];
