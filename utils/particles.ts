export type ParticleInfo = {
    particle: string;
    definition: string;
    structure: string;
};

export const particlesDict: Record<string, ParticleInfo> = {
    "wa": {
        particle: "は (wa)",
        definition: "Topic Marker: Indicates the topic of the sentence.",
        structure: "[Topic] + wa + [Comment]"
    },
    "ga": {
        particle: "が (ga)",
        definition: "Subject Marker: Marks the grammatical subject of the sentence.",
        structure: "[Subject] + ga + [Verb/Adjective]"
    },
    "o": {
        particle: "を (o/wo)",
        definition: "Object Marker: Marks the direct object of an action.",
        structure: "[Object] + o + [Transitive Verb]"
    },
    "wo": {
        particle: "を (o/wo)",
        definition: "Object Marker: Marks the direct object of an action.",
        structure: "[Object] + o + [Transitive Verb]"
    },
    "ni": {
        particle: "に (ni)",
        definition: "Target/Time Marker: Indicates location, time, or target of motion.",
        structure: "[Time/Place/Target] + ni + [Verb]"
    },
    "de": {
        particle: "で (de)",
        definition: "Context Marker: Indicates where an action takes place or the means used.",
        structure: "[Place/Tool] + de + [Action]"
    },
    "e": {
        particle: "へ (e/he)",
        definition: "Direction Marker: Indicates the direction of movement.",
        structure: "[Destination] + e + [Motion Verb]"
    },
    "he": {
        particle: "へ (e/he)",
        definition: "Direction Marker: Indicates the direction of movement.",
        structure: "[Destination] + e + [Motion Verb]"
    },
    "to": {
        particle: "と (to)",
        definition: "Connector: Used for 'and' (nouns) or 'with' (people).",
        structure: "[Noun] + to + [Noun]"
    },
    "no": {
        particle: "の (no)",
        definition: "Possessive Particle: Indicates ownership or modification.",
        structure: "[Owner/Modifier] + no + [Noun]"
    },
    "mo": {
        particle: "も (mo)",
        definition: "Inclusive Marker: Means 'also' or 'too'.",
        structure: "[Noun] + mo + [Verb]"
    },
    "ka": {
        particle: "か (ka)",
        definition: "Question Marker: Turns a sentence into a question.",
        structure: "[Sentence] + ka"
    },
    "kara": {
        particle: "から (kara)",
        definition: "Starting Point: Means 'from' or 'because'.",
        structure: "[Source/Reason] + kara"
    },
    "made": {
        particle: "まで (made)",
        definition: "Limit Marker: Means 'until' or 'as far as'.",
        structure: "[End Point] + made"
    },
    "yo": {
        particle: "よ (yo)",
        definition: "Emphasis Marker: Adds assertion or emphasis to a statement.",
        structure: "[Sentence] + yo"
    },
    "ne": {
        particle: "ね (ne)",
        definition: "Agreement Marker: Seeks agreement or confirmation (like 'right?').",
        structure: "[Sentence] + ne"
    }
};

export function isParticle(romaji: string): boolean {
    return romaji.toLowerCase() in particlesDict;
}

export function getParticleInfo(romaji: string): ParticleInfo | undefined {
    return particlesDict[romaji.toLowerCase()];
}
