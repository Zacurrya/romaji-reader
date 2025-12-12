"use client";

import { useState, useEffect } from "react";
import { n5Questions } from "./contexts/questions";
import { sentenceQuestions } from "./contexts/sentence_questions";
import { listeningQuestions } from "./contexts/listening_questions";
import { Question } from "./contexts/types";
import { motion, AnimatePresence } from "framer-motion";
import QuizInput from "./_components/QuizInput";

export default function N5QuizPage() {
    // Game State
    const [quizState, setQuizState] = useState<"start" | "playing" | "finished">("start");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState<(boolean | null)[]>([]);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);

    // Input State
    const [userMethod, setUserMethod] = useState<"choice" | "input">("choice"); // Derived from question type
    const [selectedOption, setSelectedOption] = useState<string | null>(null); // For choice
    const [inputValue, setInputValue] = useState(""); // For input
    const [isAnswered, setIsAnswered] = useState(false);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

    // Initialize Quiz
    const startQuiz = (count: number) => {
        // Shuffle and slice
        const allQuestions = [...n5Questions, ...sentenceQuestions, ...listeningQuestions];
        // Fisher-Yates Shuffle
        for (let i = allQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        }
        setQuestions(allQuestions.slice(0, count));
        setHistory(new Array(count).fill(null));
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizState("playing");
        resetTurn();
    };

    const resetTurn = () => {
        setSelectedOption(null);
        setInputValue("");
        setIsAnswered(false);
        setFeedback(null);
        setFocusedOptionIndex(-1);
    };

    const currentQ = questions[currentQuestionIndex];
    const isInputType = currentQ?.type === "KANA_TO_KANJI_INPUT" || currentQ?.type === "TRANSLATION_INPUT";

    // Handle Choice Selection
    const handleOptionSelect = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
        submitAnswer(option);
    };

    // Handle Input Submission
    const handleInputSubmit = () => {
        if (isAnswered || !inputValue.trim()) return;
        submitAnswer(inputValue.trim());
    };

    const submitAnswer = (answer: string) => {
        setIsAnswered(true);
        const correct = currentQ.correctAnswer;
        let isCorrect = false;

        if (Array.isArray(correct)) {
            isCorrect = correct.includes(answer);
        } else {
            isCorrect = correct === answer;
        }

        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedback("correct");
        } else {
            setFeedback("incorrect");
        }

        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[currentQuestionIndex] = isCorrect;
            return newHistory;
        });
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetTurn();
        } else {
            setQuizState("finished");
        }
    };

    // Global Enter key listener for Next Question
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && isAnswered) {
                e.preventDefault();
                e.stopPropagation();
                nextQuestion();
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, [isAnswered, currentQuestionIndex, questions.length]);

    // Passing Logic: 80/180 => ~44.4%
    const passingPercentage = (80 / 180) * 100;
    const userPercentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
    const isPassed = userPercentage >= passingPercentage;

    // Arrow Key Navigation for Choice Questions
    useEffect(() => {
        if (!currentQ || isInputType || isAnswered) return;

        const handleArrowKey = (e: KeyboardEvent) => {
            if (!currentQ.options) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocusedOptionIndex(prev => Math.min(prev + 1, currentQ.options!.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusedOptionIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === "Enter" && focusedOptionIndex >= 0) {
                e.preventDefault();
                e.stopPropagation();
                handleOptionSelect(currentQ.options![focusedOptionIndex]);
            }
        };

        window.addEventListener("keydown", handleArrowKey);
        return () => window.removeEventListener("keydown", handleArrowKey);
    }, [currentQ, isInputType, isAnswered, focusedOptionIndex]);

    // Helper to determine question instructions
    const getInstruction = (q: Question) => {
        switch (q.type) {
            case "KANA_TO_KANJI_INPUT": return "Type the reading (Kana)";
            case "KANA_TO_KANJI_CHOICE": return "Select the correct Kanji";
            case "TRANSLATION_CHOICE": return "Select the correct meaning";
            case "TRANSLATION_INPUT": return "Type the Japanese translation";
            case "LISTENING_COMPREHENSION": return "Listen to the audio and answer";
            default: return "Answer the question";
        }
    };



    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] text-gray-900 flex flex-col items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {quizState === "start" && (
                    <motion.div
                        key="start"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-md w-full text-center space-y-8"
                    >
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">JLPT N5 Quiz</h1>
                            <p className="text-gray-500">Test your Japanese skills.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[10, 20].map((count) => (
                                <button
                                    key={count}
                                    onClick={() => startQuiz(count)}
                                    disabled={false /*n5Questions.length < count*/}
                                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-medium py-4 px-6 rounded-2xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                                >
                                    Start {count} Questions
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {quizState === "playing" && currentQ && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-lg w-full"
                    >
                        {/* Progress Bar */}
                        {/* History Bar */}
                        <div className="flex gap-2 w-full mb-8 px-1">
                            {history.map((result, idx) => (
                                <div
                                    key={idx}
                                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${result === true ? 'bg-green-500 shadow-sm shadow-green-200' :
                                        result === false ? 'bg-red-500 shadow-sm shadow-red-200' :
                                            idx === currentQuestionIndex ? 'bg-blue-400 scale-110' : 'bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 mb-6 text-center">
                            <h2 className="no-interact-text text-3xl font-serif font-bold text-gray-900 mb-2">
                                {currentQ.question}
                            </h2>
                            <p className="no-interact-text text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">
                                {getInstruction(currentQ)}
                            </p>

                            {/* Audio Player for Listening Questions */}
                            {currentQ.type === "LISTENING_COMPREHENSION" && (currentQ as any).audioUrl && (
                                <div className="mb-8 w-full flex justify-center">
                                    <audio controls src={(currentQ as any).audioUrl} className="w-full max-w-sm" />
                                </div>
                            )}

                            {/* --- INPUT TYPE --- */}
                            {isInputType && (
                                <div className="space-y-6" key={currentQ.id}>
                                    <QuizInput
                                        value={inputValue}
                                        onChange={setInputValue}
                                        onSubmit={handleInputSubmit}
                                        disabled={isAnswered}
                                        autoFocus
                                    />
                                    {isAnswered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-xl border ${feedback === "correct" ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"}`}
                                        >
                                            <p className="font-bold mb-1">
                                                {feedback === "correct" ? "Correct!" : "Incorrect"}
                                            </p>
                                            {feedback === "incorrect" && (
                                                <p className="text-sm">
                                                    Correct answer: <span className="font-bold">{Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer[0] : currentQ.correctAnswer}</span>
                                                </p>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {/* --- CHOICE TYPE --- */}
                            {!isInputType && currentQ.options && (
                                <div className="grid grid-cols-1 gap-3">
                                    {currentQ.options.map((option, idx) => {
                                        let styleClass = "border-gray-200 hover:border-gray-300 hover:bg-gray-50";

                                        if (isAnswered) {
                                            if (option === currentQ.correctAnswer || (Array.isArray(currentQ.correctAnswer) && currentQ.correctAnswer.includes(option))) {
                                                styleClass = "bg-green-50 border-green-200 text-green-700";
                                            } else if (option === selectedOption) {
                                                styleClass = "bg-red-50 border-red-200 text-red-700";
                                            } else {
                                                styleClass = "opacity-50 border-gray-100";
                                            }
                                        } else if (idx === focusedOptionIndex) {
                                            styleClass = "border-blue-400 bg-blue-50 text-blue-800 shadow-md ring-2 ring-blue-100";
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionSelect(option)}
                                                onMouseEnter={() => setFocusedOptionIndex(idx)}
                                                disabled={isAnswered}
                                                className={`w-full py-4 px-6 rounded-xl border text-left transition-all duration-200 text-lg font-medium ${styleClass}`}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Next Button */}
                        <div className="flex justify-end h-14">
                            {isAnswered && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    autoFocus
                                    onClick={nextQuestion}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-colors"
                                >
                                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}

                {quizState === "finished" && (
                    <motion.div
                        key="finished"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full text-center"
                    >
                        <div className="bg-white rounded-3xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm ${isPassed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                                {isPassed ? "🎉" : "💪"}
                            </div>

                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                                {isPassed ? "Congratulations!" : "Keep Trying!"}
                            </h2>
                            <p className="text-gray-500 mb-8">
                                You scored <span className="text-gray-900 font-bold">{score}</span> out of {questions.length}
                            </p>

                            <div className="w-full bg-gray-100 h-3 rounded-full mb-6 overflow-hidden relative">
                                <div className="absolute top-0 bottom-0 left-[44.4%] w-0.5 bg-gray-400 z-10" title="Passing Mark"></div>
                                <div
                                    className={`h-full rounded-full ${isPassed ? "bg-green-500" : "bg-red-500"}`}
                                    style={{ width: `${userPercentage}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mb-8 uppercase tracking-widest">
                                Passing Score: 44%
                            </p>

                            <button
                                onClick={() => setQuizState("start")}
                                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-all hover:-translate-y-0.5"
                            >
                                Back to Start
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
