import { InvalidInput } from "@domain/errors/InvalidInput";
import { UUID } from "node:crypto";

export class Category {
    constructor(
        public readonly id: UUID,
        public readonly workspaceId: UUID,
        public readonly name: string,
        public readonly classification: "income" | "expense",
        public readonly subclassification: "regular" | "irregular" | "fixed" | "fun" | "future",
    ) {
        if (name.trim() == '') {
            throw new InvalidInput("A name is required.");
        }

        const isIncomeClassification = classification === "income";
        const isExpenseClassification = classification === "expense";

        const isValidIncomeSubclassification =
            subclassification === "regular" ||
            subclassification === "irregular";

        const isValidExpenseSubclassification =
            subclassification === "fixed" ||
            subclassification === "fun" ||
            subclassification === "future"

        if (!isIncomeClassification && !isExpenseClassification) {
            throw new InvalidInput(
                `The provided classification, ${classification}, is invalid.`
            );
        }

        if (isIncomeClassification && !isValidIncomeSubclassification) {
            throw new InvalidInput(
                `'${subclassification}' is not a valid income subclassification.`
            );
        }

        if (isExpenseClassification && !isValidExpenseSubclassification) {
            throw new InvalidInput(
                `'${subclassification}' is not a valid expense subclassification.`
            );
        }
    }
}