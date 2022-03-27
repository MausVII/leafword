export type LeafMode = "Card" | "Add" | "Browse" | "Filters" | "Settings" | "Help"

export type CardData = {
    kanji: string,
    variants: string[] | [],
    components: string[] | [],
    tags: string[],
    pitch: string[],
    priority: number,
    hiragana: string,
    eng_def: string,
    jap_def: string,
    notes: string,
    createdAt?: number,
    updatedAt?: number,
}

// Rising, High, Falling, Low
export type Pitch = 'r' | 'h' | 'f' | 'l'