import { InvalidInput } from "@domain/errors/InvalidInput";
import { UUID } from "node:crypto";

export class Workspace {
    constructor(
        public readonly id: UUID,
        public readonly name: string,
        public readonly description: string,
        public readonly dateCreated: Date,
        public readonly currencyCode: string,
    ) {
        if (name.trim() == '') {
            throw new InvalidInput("A name is required.");
        }

        // TODO: Validate currencyCode
    }

}