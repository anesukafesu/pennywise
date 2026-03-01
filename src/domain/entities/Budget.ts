import { InvalidInput } from "@domain/errors/InvalidInput";
import { UUID } from "node:crypto";

export class Budget {
    constructor(
        public id: UUID,
        public workspaceId: UUID,
        public year: number,
        public month: number,
    ) {
        if (month < 1 || month > 12) {
            throw new InvalidInput("Month must be a number between 1 and 12 months.");
        }

        if (year < 2000 || year > 3000) {
            throw new InvalidInput("Year must be a number between 2000 and 3000.");
        }
    }
}