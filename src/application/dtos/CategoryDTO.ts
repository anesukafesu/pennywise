import { Category } from "@entities/Category";

export interface CategoryDTO {
    id: string;
    name: string;
    workspaceId: string;
    classification: Category["classification"];
    subclassification: Category["subclassification"];
}