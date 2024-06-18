export type ComponentProps<T = {}> = Readonly<{
    children?: React.ReactNode;
} & T>;

export enum GameMode {
	Favorite = 'favorite',
	Ordinary = 'ordinary',
	Advanced = 'advanced',
}