export type ComponentProps<T = {}> = Readonly<{
    children?: React.ReactNode;
} & T>;