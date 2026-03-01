import { Category as CategoryEntity } from "@entities/Category";
import { Models } from "node-appwrite";

export interface CategoryRowData extends Omit<CategoryEntity, "id" | "workspaceId"> {
    workspaceId: string;
}

export interface AppwriteCategoryRow extends Models.Row, CategoryRowData {}