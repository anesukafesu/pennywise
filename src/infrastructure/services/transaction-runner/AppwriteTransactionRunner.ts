import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";

export class AppwriteTransactionRunner {
  constructor(private readonly db: AppwriteDatabaseService) {}

  async run<T>(fn: (ctx: TransactionContext) => Promise<T>) {
    const transactionId = await this.db.createTransaction();
    const tx = { id: transactionId };
    const result = await fn(tx);
    await this.db.commitTransaction(transactionId);
    return result;
  }
}
