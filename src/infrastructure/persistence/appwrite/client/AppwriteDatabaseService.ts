import { DatabaseError } from "@application/errors/DatabaseError";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Insertable } from "@appwrite/models/helpers/Insertable";
import { AppwriteException, Client, TablesDB, Models } from "node-appwrite";

type CreateRowParams<T extends Models.DefaultRow> = {
  tableId: string;
  rowId: string;
  data: Insertable<T>;
  tx?: TransactionContext;
};

type ListRowsParams = {
  tableId: string;
  queries: string[];
  tx?: TransactionContext;
};

type GetRowParams = {
  tableId: string;
  rowId: string;
  tx?: TransactionContext;
};

type UpdateRowParams<T extends Models.DefaultRow> = {
  tableId: string;
  rowId: string;
  data: Insertable<T>;
  tx?: TransactionContext;
};

type DeleteRowParams = {
  tableId: string;
  rowId: string;
  tx?: TransactionContext;
};

type DeleteRows = {
  tableId: string;
  queries: string[];
  tx?: TransactionContext;
};

export class AppwriteDatabaseService {
  public readonly db: TablesDB;
  public readonly databaseId: string;

  constructor(
    projectEndpoint: string,
    projectId: string,
    apiKey: string,
    databaseId: string,
  ) {
    const client = new Client()
      .setEndpoint(projectEndpoint)
      .setProject(projectId)
      .setKey(apiKey);

    this.db = new TablesDB(client);
    this.databaseId = databaseId;
  }

  async performDatabaseOperation<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof AppwriteException) {
        throw new DatabaseError(`Database Error ${e.code}: e.message.`);
      }

      throw new DatabaseError("Unknown Database Error.");
    }
  }

  async createRow<T extends Models.DefaultRow>(
    params: CreateRowParams<T>,
  ): Promise<void> {
    await this.performDatabaseOperation(async () => {
      await this.db.createRow<T>({
        databaseId: this.databaseId,
        tableId: params.tableId,
        rowId: params.rowId,
        data: params.data,
        transactionId: params.tx?.id,
      });
    });
  }

  async listRows<T extends Models.Row>(
    params: ListRowsParams,
  ): Promise<Models.RowList<T>> {
    return this.performDatabaseOperation<Models.RowList<T>>(async () => {
      return this.db.listRows<T>({
        databaseId: this.databaseId,
        tableId: params.tableId,
        queries: params.queries,
        transactionId: params.tx?.id,
      });
    });
  }

  async getRow<T extends Models.Row>(params: GetRowParams): Promise<T> {
    return this.performDatabaseOperation<T>(async () => {
      // TODO: What happens when there is no row with provided row Id
      return this.db.getRow<T>({
        databaseId: this.databaseId,
        tableId: params.tableId,
        rowId: params.rowId,
        transactionId: params.tx?.id,
      });
    });
  }

  async updateRow<T extends Models.DefaultRow>(
    params: UpdateRowParams<T>,
  ): Promise<void> {
    return this.performDatabaseOperation(async () => {
      await this.db.updateRow<T>({
        databaseId: this.databaseId,
        tableId: params.tableId,
        rowId: params.rowId,
        data: params.data,
        transactionId: params.tx?.id,
      });
    });
  }

  async deleteRow(params: DeleteRowParams): Promise<void> {
    return this.performDatabaseOperation(async () => {
      await this.db.deleteRow({
        databaseId: this.databaseId,
        tableId: params.tableId,
        rowId: params.rowId,
        transactionId: params.tx?.id,
      });
    });
  }

  async deleteRows(params: DeleteRows): Promise<void> {
    return this.performDatabaseOperation(async () => {
      await this.db.deleteRows({
        databaseId: this.databaseId,
        tableId: params.tableId,
        queries: params.queries,
        transactionId: params.tx?.id,
      });
    });
  }

  async createTransaction(): Promise<string> {
    const transaction = await this.db.createTransaction();
    return transaction.$id;
  }

  async commitTransaction(transactionId: string): Promise<void> {
    await this.db.updateTransaction({
      transactionId,
      commit: true,
    });
  }
}
