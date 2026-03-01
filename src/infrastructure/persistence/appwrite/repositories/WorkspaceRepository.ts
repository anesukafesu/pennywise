import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { AppwriteWorkspaceRow } from "@appwrite-models/Workspace";
import { Workspace as WorkspaceEntity } from "@entities/Workspace";
import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";
import { WorkspaceMapper } from "@infrastructure/persistence/appwrite/mappers/Workspace";
import { Query } from "node-appwrite";
import { UUID } from "node:crypto";

export class AppwriteWorkspaceRepository implements WorkspaceRepository {
  private readonly tableId = "workspaces";

  constructor(private readonly db: AppwriteDatabaseService) {}

  async createOne(
    workspace: WorkspaceEntity,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.createRow({
      tableId: this.tableId,
      rowId: workspace.id,
      data: WorkspaceMapper.toPersistence(workspace),
      tx: tx,
    });
  }

  async getOneById(
    id: string,
    tx?: TransactionContext,
  ): Promise<WorkspaceEntity | undefined> {
    const workspaceRow = await this.db.getRow<AppwriteWorkspaceRow>({
      tableId: this.tableId,
      rowId: id,
      tx: tx,
    });

    if (!workspaceRow) return undefined;
    return WorkspaceMapper.fromPersistence(workspaceRow);
  }

  async getManyByIds(
    workspaceIds: UUID[],
    tx?: TransactionContext,
  ): Promise<WorkspaceEntity[]> {
    const { rows } = await this.db.listRows<AppwriteWorkspaceRow>({
      tableId: this.tableId,
      queries: [Query.equal("$id", workspaceIds)],
      tx: tx,
    });

    return rows.map(WorkspaceMapper.fromPersistence);
  }

  async updateOne(
    workspace: WorkspaceEntity,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.updateRow({
      tableId: this.tableId,
      rowId: workspace.id,
      data: WorkspaceMapper.toPersistence(workspace),
      tx: tx,
    });
  }

  async deleteOneById(id: string, tx?: TransactionContext): Promise<void> {
    await this.db.deleteRow({
      tableId: this.tableId,
      rowId: id,
      tx: tx,
    });
  }
}
