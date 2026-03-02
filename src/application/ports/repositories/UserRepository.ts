import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { User } from "@entities/User";
import { UUID } from "node:crypto";

export interface UserRepository {
  createOne(user: User, tx?: TransactionContext): Promise<void>;

  getOneById(userId: UUID, tx?: TransactionContext): Promise<User | undefined>;

  getOneByEmail(
    email: string,
    tx?: TransactionContext,
  ): Promise<User | undefined>;

  getManyByIds(ids: UUID[], tx?: TransactionContext): Promise<User[]>;

  updateOne(user: User, tx?: TransactionContext): Promise<void>;

  deleteOneById(id: UUID, tx?: TransactionContext): Promise<void>;
}
