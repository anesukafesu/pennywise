import {
  TransactionContext,
  TransactionRunner,
} from "@application/ports/services/TransactionRunner";
import {
  PostgresDatabaseService,
  PostgresTransactionContext,
} from "@infrastructure/persistence/postgres/client/PostgresDatabaseService";
import { randomUUID } from "node:crypto";

export class PostgresTransactionRunner implements TransactionRunner {
  constructor(private readonly db: PostgresDatabaseService) {}

  async run<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T> {
    const client = await this.db.getPool().connect();

    try {
      await client.query("BEGIN");

      const tx: PostgresTransactionContext = {
        id: randomUUID(),
        client,
      };

      const result = await fn(tx);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
