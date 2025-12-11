import { romajiToKana } from "@/utils/romajiToKana";

type TranslatedOutputProps = {
    translation: string;
};

const TranslatedOutput = ({ translation }: TranslatedOutputProps) => {
    // romajiToKana (wanakana) handles the full string conversion automatically
    const kana = romajiToKana(translation);

    return (
        <h1 className="text-6xl font-bold text-center mb-8 min-h-[4rem]">
            {kana}
        </h1>
    );
};

export default TranslatedOutput;