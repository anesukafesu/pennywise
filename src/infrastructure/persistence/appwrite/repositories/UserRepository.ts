import { UserRepository } from "@application/ports/repositories/UserRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { AppwriteUserRow } from "@appwrite-models/User";
import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";
import { User as UserEntity } from "@entities/User";
import { UserMapper } from "@infrastructure/persistence/appwrite/mappers/User";
import { Query } from "node-appwrite";

export class AppwriteUserRepository implements UserRepository {
  private readonly tableId = "users";

  constructor(private readonly db: AppwriteDatabaseService) {}

  async createOne(user: UserEntity, tx?: TransactionContext): Promise<void> {
    await this.db.createRow({
      tableId: this.tableId,
      rowId: user.id,
      data: UserMapper.toPersistence(user),
      tx: tx,
    });
  }

  async getOneById(
    userId: string,
    tx?: TransactionContext,
  ): Promise<UserEntity | undefined> {
    const userRow = await this.db.getRow<AppwriteUserRow>({
      tableId: this.tableId,
      rowId: userId,
      tx: tx,
    });

    if (!userRow) return undefined;
    return UserMapper.fromPersistence(userRow);
  }

  async getOneByEmail(
    email: string,
    tx?: TransactionContext,
  ): Promise<UserEntity | undefined> {
    const { rows } = await this.db.listRows<AppwriteUserRow>({
      tableId: this.tableId,
      queries: [Query.equal("email", email)],
      tx: tx,
    });

    if (rows.length === 0) return undefined;
    return UserMapper.fromPersistence(rows[0]);
  }

  async updateOne(user: UserEntity, tx?: TransactionContext): Promise<void> {
    await this.db.updateRow({
      tableId: this.tableId,
      rowId: user.id,
      data: UserMapper.toPersistence(user),
      tx: tx,
    });
  }

  async deleteOneById(userId: string, tx?: TransactionContext): Promise<void> {
    await this.db.deleteRow({
      tableId: this.tableId,
      rowId: userId,
      tx: tx,
    });
  }
}
