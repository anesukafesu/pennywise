import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Workspace } from "@entities/Workspace";
import { UUID } from "node:crypto";

export interface WorkspaceRepository {
  createOne(workspace: Workspace, tx?: TransactionContext): Promise<void>;

  getOneById(id: UUID, tx?: TransactionContext): Promise<Workspace | undefined>;

  getManyByIds(ids: UUID[], tx?: TransactionContext): Promise<Workspace[]>;

  deleteOneById(id: UUID, tx?: TransactionContext): Promise<void>;

  updateOne(workspace: Workspace, tx?: TransactionContext): Promise<void>;
}
