"use client";

type TooltipProps = {
    character: string;
    type: string;
    definition: string;
    info?: string;
};

export default function Tooltip({ character, type, definition, info }: TooltipProps) {
    return (
        <div className="relative min-w-[240px] w-max bg-white text-gray-900 p-5 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 pointer-events-none border border-gray-100/50 ring-1 ring-black/5">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-gray-100 pb-3 mb-3">
                <span className="font-serif text-3xl font-bold text-gray-900 leading-none">{character}</span>
                <span className="text-[0.6rem] text-muted-foreground font-serif tracking-[0.2em] uppercase mb-1">{type}</span>
            </div>

            {/* Definition */}
            <p className="w-[240px] text-xs text-gray-600 mb-4 leading-relaxed font-sans font-medium">
                {definition}
            </p>

            {/* Info / Structure (Optional) */}
            {info && (
                <div className="bg-gray-50/80 rounded-xl p-3 text-center border border-gray-200/60 overflow-hidden">
                    <code className="text-xs text-gray-700 font-mono tracking-tight font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
                        {info}
                    </code>
                </div>
            )}

            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white drop-shadow-sm filter"></div>
        </div>
    );
}