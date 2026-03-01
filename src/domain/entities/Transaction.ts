import { InvalidInput } from "@domain/errors/InvalidInput";
import { UUID } from "node:crypto";

export class Transaction {
    constructor(
        public readonly id: UUID,
        public readonly workspaceId: UUID,
        public readonly date: Date,
        public readonly categoryId: UUID,
        public readonly amount: number,
        public readonly notes: string,
        public readonly documentationUrl: string,
    ) {
        if (amount <= 0) {
            throw new InvalidInput("Amount must be greater than 0.");
        }
    }
}