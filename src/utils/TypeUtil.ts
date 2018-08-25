export type Diff<T, U> = T extends U ? never : T;
// type Filter<T, U> = T extends U ? T : never;

export type Subtract<From, Values> = {
  [K in Diff<keyof From, keyof Values>]: From[K]
};

// type Intersect<First, Second> = {
//   [K in Filter<keyof First, keyof Second>]: First[K]
// };

export type Omit<T, K extends keyof T> = Pick<
  T,
  ({ [P in keyof T]: P } &
    { [P in K]: never } & { [x: string]: never })[keyof T]
>;

export type WithRequired<T, Keys extends keyof T> = T & Required<Pick<T, Keys>>;
