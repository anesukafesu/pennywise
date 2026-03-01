import { AppwriteBudgetRow, BudgetRowData } from "@appwrite-models/Budget";
import { toUUID } from "@domain/value-objects/toUUID";
import { Budget as BudgetEntity } from "@entities/Budget";

export class BudgetMapper {
    static toPersistence(budget: BudgetEntity): BudgetRowData {
        return {
            workspaceId: budget.workspaceId,
            year: budget.year,
            month: budget.month,
        }
    }

    static fromPersistence(budget: AppwriteBudgetRow): BudgetEntity {
        return new BudgetEntity(
            toUUID(budget.$id),
            toUUID(budget.workspaceId),
            budget.year,
            budget.month,
        )
    }
}