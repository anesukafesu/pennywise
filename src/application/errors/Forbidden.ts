import { UUID } from "node:crypto";

export class Forbidden extends Error {
    constructor(userId: UUID, operation: string) {
        super(`The user: ${userId} does not have permission to perform operation: ${operation}.`);
    }
}