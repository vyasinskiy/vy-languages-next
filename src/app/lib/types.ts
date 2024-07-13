export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type ComponentProps<T = {}> = Readonly<{
    children?: React.ReactNode;
} & T>;
