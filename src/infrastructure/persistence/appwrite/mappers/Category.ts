import { AppwriteCategoryRow, CategoryRowData } from "@appwrite-models/Category";
import { toUUID } from "@domain/value-objects/toUUID";
import { Category as CategoryEntity } from "@entities/Category";

export class CategoryMapper {
    static toPersistence(category: CategoryEntity): CategoryRowData {
        return {
            workspaceId: category.workspaceId,
            name: category.name,
            classification: category.classification,
            subclassification: category.subclassification,
        }
    }

    static fromPersistence(category: AppwriteCategoryRow): CategoryEntity {
        return new CategoryEntity(
            toUUID(category.$id),
            toUUID(category.workspaceId),
            category.name,
            category.classification,
            category.subclassification,
        )
    }
}