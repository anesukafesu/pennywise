import { InviteRepository } from "@application/ports/repositories/InviteRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { AppwriteInviteRow } from "@appwrite-models/Invite";
import { Invite as InviteEntity } from "@entities/Invite";
import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";
import { InviteMapper } from "@infrastructure/persistence/appwrite/mappers/Invite";
import { Query } from "node-appwrite";
import { UUID } from "node:crypto";

export class AppwriteInviteRepository implements InviteRepository {
  private readonly tableId = "invites";

  constructor(private readonly db: AppwriteDatabaseService) {}

  async createOne(
    invite: InviteEntity,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.createRow({
      tableId: this.tableId,
      rowId: invite.id,
      data: InviteMapper.toPersistence(invite),
      tx: tx,
    });
  }

  async getOneById(
    id: UUID,
    tx?: TransactionContext,
  ): Promise<InviteEntity | undefined> {
    const inviteRow = await this.db.getRow<AppwriteInviteRow>({
      tableId: this.tableId,
      rowId: id,
      tx: tx,
    });

    if (!inviteRow) return undefined;
    return InviteMapper.fromPersistence(inviteRow);
  }

  async getOneByUserIdAndWorkspaceId(
    userId: UUID,
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<InviteEntity | undefined> {
    const { rows } = await this.db.listRows<AppwriteInviteRow>({
      tableId: this.tableId,
      queries: [
        Query.equal("userId", userId),
        Query.equal("workspaceId", workspaceId),
      ],
      tx: tx,
    });

    if (rows.length === 0) return undefined;
    return InviteMapper.fromPersistence(rows[0]);
  }

  async deleteManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.deleteRows({
      tableId: this.tableId,
      queries: [Query.equal("workspaceId", workspaceId)],
      tx: tx,
    });
  }

  async deleteManyByUserId(
    userId: UUID,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.deleteRows({
      tableId: this.tableId,
      queries: [Query.equal("userId", userId)],
      tx: tx,
    });
  }

  async deleteOneById(id: UUID, tx?: TransactionContext): Promise<void> {
    await this.db.deleteRow({
      tableId: this.tableId,
      rowId: id,
      tx: tx,
    });
  }
}
