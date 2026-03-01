import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Credential } from "@entities/Credential";
import { UUID } from "node:crypto";

export interface CredentialRepository {
  createOne(credential: Credential, tx?: TransactionContext): Promise<void>;

  findByIdentifier(
    identifier: string,
    tx?: TransactionContext,
  ): Promise<Credential | undefined>;

  update(credential: Credential, tx?: TransactionContext): Promise<void>;

  deleteByIdentifier(
    identifier: string,
    tx?: TransactionContext,
  ): Promise<void>;

  deleteManyByUserId(userId: UUID, tx?: TransactionContext): Promise<void>;
}
