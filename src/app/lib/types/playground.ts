import { getTranslationsDbItems } from "../queries/playground";
import { ArrayElement } from "../types";

export enum GameMode {
	Favorite = 'favorite',
	Ordinary = 'ordinary',
	Advanced = 'advanced',
}

export interface PlaygroundItem {
    wordIdFrom: number;
    wordFrom: string;
    exampleFrom: string | null;
    wordIdTo: number;
    wordTo: string;
    exampleTo: string | null;
    translationId: number;
    isFavorite: boolean;
}

export type TranslationDbItem = ArrayElement<Awaited<ReturnType<typeof getTranslationsDbItems>>>;