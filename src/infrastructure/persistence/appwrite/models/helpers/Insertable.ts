import { Models } from "node-appwrite";

export type Insertable<T extends Models.DefaultRow> =
    T extends Models.DefaultRow
        ? Partial<Models.Row> & Record<string, any>
        : Partial<Models.Row> & Omit<T, keyof Models.Row>;
