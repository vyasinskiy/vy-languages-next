import { TranslationDbItem } from "../queries/playground";
import { PlaygroundItem } from "../types/playground";

export const mapTranslationDbItemToPlaygroundItem = (dbItem: TranslationDbItem): PlaygroundItem => {
    const wordFrom = dbItem.words_translations_word_id_fromTowords;
    const wordTo = dbItem.words_translations_word_id_toTowords;
    return {
        wordFrom: wordFrom.word,
        exampleFrom: wordFrom.word_example,
        wordTo: wordTo.word,
        exampleTo: wordTo.word_example,
    }
}