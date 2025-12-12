"use client";

import { Search } from "lucide-react";

type SearchBarProps = {
    input: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isFlashing: boolean;
};

export default function SearchBar({ input, handleChange, handleKeyDown, isFlashing }: SearchBarProps) {
    return (
        <div className={`w-full max-w-3xl transition-transform duration-100 ${isFlashing ? 'translate-x-[5px] text-red-500' : ''}`}>
            <div className={`relative w-full h-14 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border flex items-center px-4 transition-all duration-300 ${isFlashing ? 'border-red-400 shadow-[0_0_20px_rgba(255,0,0,0.2)]' : 'border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`}>

                <input
                    type="text"
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 h-full pl-6 bg-transparent text-xl text-gray-800 font-medium outline-none placeholder:text-gray-300"
                    placeholder="Type in Japanese..."
                    autoFocus
                />

                {/* Removed Search Icon as requested */}
                {/* <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer hover:bg-black transition-colors">
                 <Search size={20} strokeWidth={2.5} />
               </div> */}

            </div>
        </div>
    );
}
