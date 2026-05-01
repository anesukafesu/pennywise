import { DatabaseError } from "@application/errors/DatabaseError";
import { TransactionContext } from "@application/ports/services/TransactionRunner";

export type Queryable = { query<T = unknown>(text: string, values?: unknown[]): Promise<{ rows: T[] }> };
export type PoolLike = Queryable & { connect(): Promise<PoolClientLike> };
export type PoolClientLike = Queryable & { release(): void };

export type PostgresTransactionContext = TransactionContext & { readonly client: PoolClientLike };

export class PostgresDatabaseService {
  constructor(private readonly pool: PoolLike) {}
  getPool(): PoolLike { return this.pool; }
  async query<T = unknown>(text: string, values: unknown[] = [], tx?: TransactionContext): Promise<{ rows: T[] }> {
    try {
      if (tx && "client" in tx) return await (tx as PostgresTransactionContext).client.query<T>(text, values);
      return await this.pool.query<T>(text, values);
    } catch (error) {
      throw new DatabaseError(`Postgres query failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
