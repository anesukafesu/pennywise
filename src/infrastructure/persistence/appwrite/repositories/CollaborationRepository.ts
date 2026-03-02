import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { AppwriteCollaborationRow } from "@appwrite-models/Collaboration";
import { Collaboration } from "@entities/Collaboration";
import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";
import { CollaborationMapper } from "@infrastructure/persistence/appwrite/mappers/Collaboration";
import { Query } from "node-appwrite";
import { UUID } from "node:crypto";

export class AppwriteCollaborationRepository implements CollaborationRepository {
  private readonly tableId = "collaborations";
  constructor(private readonly db: AppwriteDatabaseService) {}

  async createOne(
    collaboration: Collaboration,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.createRow({
      tableId: this.tableId,
      rowId: collaboration.id,
      data: CollaborationMapper.toPersistence(collaboration),
      tx: tx,
    });
  }

  async getOneById(
    id: UUID,
    tx?: TransactionContext,
  ): Promise<Collaboration | undefined> {
    const collaborationRow = await this.db.getRow<AppwriteCollaborationRow>({
      tableId: this.tableId,
      rowId: id,
      tx: tx,
    });

    if (!collaborationRow) return undefined;
    return CollaborationMapper.fromPersistence(collaborationRow);
  }

  async getOneByUserIdAndWorkspaceId(
    userId: UUID,
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Collaboration | undefined> {
    const { rows } = await this.db.listRows<AppwriteCollaborationRow>({
      tableId: this.tableId,
      queries: [
        Query.equal("userId", userId),
        Query.equal("workspaceId", workspaceId),
      ],
      tx: tx,
    });

    if (rows.length === 0) return undefined;
    return CollaborationMapper.fromPersistence(rows[0]);
  }

  async getManyByUserId(
    userId: UUID,
    tx?: TransactionContext,
  ): Promise<Collaboration[]> {
    const { rows } = await this.db.listRows<AppwriteCollaborationRow>({
      tableId: this.tableId,
      queries: [Query.equal("userId", userId)],
      tx: tx,
    });

    return rows.map(CollaborationMapper.fromPersistence);
  }

  async getManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Collaboration[]> {
    const { rows } = await this.db.listRows<AppwriteCollaborationRow>({
      tableId: this.tableId,
      queries: [Query.equal("workspaceId", workspaceId)],
      tx: tx,
    });

    return rows.map(CollaborationMapper.fromPersistence);
  }

  async doesUserOwnWorkspaces(
    userId: UUID,
    tx?: TransactionContext,
  ): Promise<boolean> {
    const { rows } = await this.db.listRows<AppwriteCollaborationRow>({
      tableId: this.tableId,
      queries: [Query.equal("userId", userId), Query.equal("role", "owner")],
      tx: tx,
    });

    return rows.length > 0;
  }

  async updateRole(
    collaborationId: UUID,
    collaborationRole: Collaboration["role"],
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.updateRow({
      tableId: this.tableId,
      rowId: collaborationId,
      data: {
        role: collaborationRole,
      },
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
}
