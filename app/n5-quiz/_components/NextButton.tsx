"use client";

import { motion } from "framer-motion";

type NextButtonProps = {
    isLastQuestion: boolean;
    onClick: () => void;
};

export default function NextButton({ isLastQuestion, onClick }: NextButtonProps) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            autoFocus
            onClick={onClick}
            className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-colors"
        >
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
        </motion.button>
    );
}
