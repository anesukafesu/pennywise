import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Invite } from "@entities/Invite";
import { UUID } from "node:crypto";

export interface InviteRepository {
  createOne(invite: Invite, tx?: TransactionContext): Promise<void>;

  getOneById(id: UUID, tx?: TransactionContext): Promise<Invite | undefined>;

  getOneByUserIdAndWorkspaceId(
    userId: UUID,
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Invite | undefined>;

  getManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Invite[]>;

  getManyByUserId(userId: UUID, tx?: TransactionContext): Promise<Invite[]>;

  deleteManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<void>;

  deleteManyByUserId(userId: UUID, tx?: TransactionContext): Promise<void>;

  deleteOneById(id: UUID, tx?: TransactionContext): Promise<void>;
}
