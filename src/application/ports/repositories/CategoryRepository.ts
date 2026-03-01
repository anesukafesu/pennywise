import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Category } from "@entities/Category";
import { UUID } from "node:crypto";

export interface CategoryRepository {
  createOne(category: Category, tx?: TransactionContext): Promise<void>;

  getOneById(id: UUID, tx?: TransactionContext): Promise<Category | undefined>;

  getManyByIds(ids: UUID[], tx?: TransactionContext): Promise<Category[]>;

  getManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Category[]>;

  getWorkspaceCategoriesAsMap(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Map<UUID, Category>>;

  updateOne(category: Category, tx?: TransactionContext): Promise<void>;

  deleteManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<void>;

  deleteOneById(id: UUID, tx?: TransactionContext): Promise<void>;
}
