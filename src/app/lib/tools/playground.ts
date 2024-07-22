import { PlaygroundItem, TranslationDbItem } from "../types/playground";
import { DEV_USER_ID } from "../constants";

export const mapTranslationDbItemToPlaygroundItem = (dbItem: TranslationDbItem): PlaygroundItem => {
    const wordFrom = dbItem.words_translations_word_id_fromTowords;
    const wordTo = dbItem.words_translations_word_id_toTowords;
    return {
        wordIdFrom: wordFrom.word_id,
        wordFrom: wordFrom.word,
        exampleFrom: wordFrom.word_example,
        wordIdTo: wordTo.word_id,
        wordTo: wordTo.word,
        exampleTo: wordTo.word_example,
        translationId: dbItem.translation_id,
        isFavorite: dbItem.progress.some(p => p.user_id === DEV_USER_ID && p.is_favorite),
    }
}

export const capitalizeFirst = (str: string) => str[0].toUpperCase() + str.slice(1);