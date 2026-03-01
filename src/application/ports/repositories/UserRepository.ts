import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { User } from "@entities/User";

export interface UserRepository {
  createOne(user: User, tx?: TransactionContext): Promise<void>;

  getOneById(
    userId: string,
    tx?: TransactionContext,
  ): Promise<User | undefined>;

  getOneByEmail(
    email: string,
    tx?: TransactionContext,
  ): Promise<User | undefined>;

  updateOne(user: User, tx?: TransactionContext): Promise<void>;

  deleteOneById(id: string, tx?: TransactionContext): Promise<void>;
}
