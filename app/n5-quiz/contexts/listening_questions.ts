import { Question } from "./types";

export type ListeningQuestion = Question & {
    type: "LISTENING_COMPREHENSION";
    audioUrl: string; // URL to the audio clip
    transcript?: string; // Optional transcript for review?
};

export const listeningQuestions: ListeningQuestion[] = [
    // Needs real URLs from Kokoro-Speech-Dataset (hosted somewhere)
    // Example:
    // {
    //     id: 201,
    //     question: "How does Sakata feel about Tokyo?",
    //     audioUrl: "/audio/sakata_tokyo.mp3", 
    //     options: ["He loves it", "He hates it", "He is indifferent", "He finds it noisy"],
    //     correctAnswer: "He loves it",
    //     type: "LISTENING_COMPREHENSION"
    // }
];
