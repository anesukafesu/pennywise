import { CredentialRepository } from "@application/ports/repositories/CredentialRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Credential as CredentialEntity } from "@entities/Credential";
import { CredentialMapper } from "@infrastructure/persistence/appwrite/mappers/Credential";
import { AppwriteCredentialRow } from "@infrastructure/persistence/appwrite/models/Credential";
import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";
import { Query } from "node-appwrite";
import { UUID } from "node:crypto";

export class AppwriteCredentialRepository implements CredentialRepository {
  constructor(private readonly db: AppwriteDatabaseService) {}

  async createOne(
    credential: CredentialEntity,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.createRow({
      tableId: "credentials",
      rowId: credential.id,
      data: CredentialMapper.toPersistence(credential),
      tx: tx,
    });
  }

  async update(
    credential: CredentialEntity,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.updateRow({
      tableId: "credentials",
      rowId: credential.id,
      data: CredentialMapper.toPersistence(credential),
      tx: tx,
    });
  }

  async findByIdentifier(
    identifier: string,
    tx?: TransactionContext,
  ): Promise<CredentialEntity | undefined> {
    const { rows } = await this.db.listRows<AppwriteCredentialRow>({
      tableId: "credentials",
      queries: [Query.equal("identifier", identifier)],
      tx: tx,
    });

    if (rows.length === 0) {
      return undefined;
    }

    return CredentialMapper.fromPersistence(rows[0]);
  }

  async deleteByIdentifier(
    identifier: string,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.deleteRow({
      tableId: "credentials",
      rowId: identifier,
      tx: tx,
    });
  }

  async deleteManyByUserId(
    userId: UUID,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.deleteRows({
      tableId: "credentials",
      queries: [Query.equal("userId", userId)],
      tx: tx,
    });
  }
}
