"use client";
import { useState } from "react";
import { toKana } from "wanakana";
import { Search } from "lucide-react";
import LiveCard from "./search/_components/LiveCard";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SentenceBar from "./components/sentenceBar/_components/SentenceBar";

export default function Home() {
  const [input, setInput] = useState("");
  const [committedWords, setCommittedWords] = useState<string[]>([]);
  const [isValidInput, setIsValidInput] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // IME-style conversion
    const kanaValue = toKana(e.target.value, { IMEMode: true });
    setInput(kanaValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && input === '' && committedWords.length > 0) {
      e.preventDefault();
      const lastWord = committedWords[committedWords.length - 1];
      setCommittedWords((prev) => prev.slice(0, -1));
      setInput(lastWord);
      return;
    }

    if ((e.key === 'Enter' || e.key === ' ') && input.trim()) {
      e.preventDefault();

      if (!isValidInput) {
        // Trigger Flash
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 300);
        return;
      }

      // Finalize conversion (e.g. 'n' -> 'ん')
      const finalWord = toKana(input);
      setCommittedWords((prev) => [...prev, finalWord]);
      setInput("");
      setIsValidInput(false); // Reset validity until new input check
    }
  };

  return (
    <div className="h-screen overflow-hidden relative">
      <Header />
      <main className="w-full h-full flex flex-col items-center justify-center bg-[#FAFAFA]">

        {/* Container for Centered Content */}
        <div className="pt-60 flex flex-col items-center justify-center mb-70">

          {/* Sentence Bar */}
          <SentenceBar words={committedWords} />

          {/* LiveCard */}
          <div className="mb-6 animate-in fade-in zoom-in duration-700">
            <LiveCard input={input} onValidationChange={setIsValidInput} />
          </div>

          {/* Search Bar */}
          <div className={`w-full max-w-3xl transition-transform duration-100 ${isFlashing ? 'translate-x-[5px] text-red-500' : ''}`}>
            <div className={`relative w-full h-14 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border flex items-center px-4 transition-all duration-300 ${isFlashing ? 'border-red-400 shadow-[0_0_20px_rgba(255,0,0,0.2)]' : 'border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`}>

              <input
                type="text"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="flex-1 h-full pl-6 bg-transparent text-xl text-gray-800 font-medium font-sans outline-none placeholder:text-gray-300"
                placeholder="Type..."
                autoFocus
              />

              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer hover:bg-black transition-colors">
                <Search size={20} strokeWidth={2.5} />
              </div>

            </div>
          </div>
        </div>
      </main>
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
}
