export interface TransactionContext {
    readonly id: string;
}

export interface TransactionRunner {
    run<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T>;
}