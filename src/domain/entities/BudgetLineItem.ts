import { InvalidInput } from "@domain/errors/InvalidInput";
import { UUID } from "node:crypto";

export class BudgetLineItem {
  constructor(
    public id: UUID,
    public budgetId: UUID,
    public categoryId: UUID,
    public amount: number,
  ) {
    if (amount < 0) {
      throw new InvalidInput("Amount must be a zero or greater.");
    }
  }
}
