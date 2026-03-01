import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Collaboration } from "@entities/Collaboration";
import { UUID } from "node:crypto";

export interface CollaborationRepository {
  createOne(
    collaboration: Collaboration,
    tx?: TransactionContext,
  ): Promise<void>;

  getOneById(
    collaborationId: UUID,
    tx?: TransactionContext,
  ): Promise<Collaboration | undefined>;

  getOneByUserIdAndWorkspaceId(
    userId: UUID,
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Collaboration | undefined>;

  getManyByUserId(
    userId: UUID,
    tx?: TransactionContext,
  ): Promise<Collaboration[]>;

  doesUserOwnWorkspaces(
    userId: UUID,
    tx?: TransactionContext,
  ): Promise<boolean>;

  updateRole(
    collaborationId: UUID,
    role: Collaboration["role"],
    tx?: TransactionContext,
  ): Promise<void>;

  deleteOneById(id: UUID, tx?: TransactionContext): Promise<void>;

  deleteManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<void>;

  deleteManyByUserId(userId: UUID, tx?: TransactionContext): Promise<void>;
}
