import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { AppwriteCategoryRow } from "@appwrite-models/Category";
import { toUUID } from "@domain/value-objects/toUUID";
import { Category } from "@entities/Category";
import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";
import { CategoryMapper } from "@infrastructure/persistence/appwrite/mappers/Category";
import { Query } from "node-appwrite";
import { UUID } from "node:crypto";

export class AppwriteCategoryRepository implements CategoryRepository {
  private readonly tableName = "categories";

  constructor(private readonly db: AppwriteDatabaseService) {}

  async createOne(category: Category, tx?: TransactionContext): Promise<void> {
    await this.db.createRow({
      tableId: this.tableName,
      rowId: category.id,
      data: CategoryMapper.toPersistence(category),
      tx: tx,
    });
  }

  async getOneById(
    id: UUID,
    tx?: TransactionContext,
  ): Promise<Category | undefined> {
    const categoryRow = await this.db.getRow<AppwriteCategoryRow>({
      tableId: this.tableName,
      rowId: id,
      tx: tx,
    });

    return CategoryMapper.fromPersistence(categoryRow);
  }

  async getManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Category[]> {
    const { rows } = await this.db.listRows<AppwriteCategoryRow>({
      tableId: this.tableName,
      queries: [Query.equal("workspaceId", workspaceId)],
      tx: tx,
    });

    return rows.map(CategoryMapper.fromPersistence);
  }

  async getManyByIds(
    ids: UUID[],
    tx?: TransactionContext,
  ): Promise<Category[]> {
    const { rows } = await this.db.listRows<AppwriteCategoryRow>({
      tableId: this.tableName,
      queries: [Query.equal("$id", ids)],
      tx: tx,
    });

    return rows.map(CategoryMapper.fromPersistence);
  }

  async getWorkspaceCategoriesAsMap(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Map<UUID, Category>> {
    const { rows } = await this.db.listRows<AppwriteCategoryRow>({
      tableId: this.tableName,
      queries: [Query.contains("workspaceId", workspaceId)],
      tx: tx,
    });

    const categoriesMap = new Map<UUID, Category>();

    for (const category of rows) {
      categoriesMap.set(
        toUUID(category.$id),
        CategoryMapper.fromPersistence(category),
      );
    }

    return categoriesMap;
  }

  async updateOne(category: Category, tx?: TransactionContext): Promise<void> {
    await this.db.updateRow({
      tableId: this.tableName,
      rowId: category.id,
      data: CategoryMapper.toPersistence(category),
      tx: tx,
    });
  }

  async deleteOneById(id: UUID, tx?: TransactionContext): Promise<void> {
    await this.db.deleteRow({
      tableId: this.tableName,
      rowId: id,
      tx: tx,
    });
  }

  async deleteManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.deleteRows({
      tableId: this.tableName,
      queries: [Query.contains("workspaceId", workspaceId)],
      tx: tx,
    });
  }
}
