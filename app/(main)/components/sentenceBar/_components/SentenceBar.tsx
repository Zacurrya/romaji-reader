import SentenceCard from "./SentenceCard";

type SentenceBarProps = {
    words: string[];
};

export default function SentenceBar({ words }: SentenceBarProps) {
    if (words.length === 0) return null;

    return (
        <div className="w-full max-w-5xl mx-auto mb-8 px-4">
            <div className="flex flex-wrap gap-2 justify-center items-start min-h-[160px]">
                {words.map((word, index) => (
                    // Using index in key because duplicates are allowed and order matters
                    <SentenceCard
                        key={`${word}-${index}`}
                        input={word}
                        context={words.slice(0, index)}
                    />
                ))}
            </div>
        </div>
    );
}
