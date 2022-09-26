export type LeafMode = "Card" | "Add" | "Browse" | "Filters" | "Settings" | "Help"

export type CardData = {
    _id?: string,
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
    createdAt?: Date,
    updatedAt?: Date,
    last_seen?: Date
}

// Rising, High, Falling, Low
export type Pitch = 'r' | 'h' | 'f' | 'l'