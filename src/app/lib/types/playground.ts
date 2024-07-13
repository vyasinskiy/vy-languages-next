import { getTranslationsDbItem } from "../queries/playground";
import { ArrayElement } from "../types";

export enum GameMode {
	Favorite = 'favorite',
	Ordinary = 'ordinary',
	Advanced = 'advanced',
}

export interface PlaygroundItem {
    wordFrom: string;
    exampleFrom: string;
    wordTo: string;
    exampleTo: string;
}

export type TranslationDbItem = ArrayElement<Awaited<ReturnType<typeof getTranslationsDbItem>>>;