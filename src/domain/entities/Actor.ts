import { UUID } from "node:crypto";

export class Actor {
    constructor(
        public readonly type: "anonymous" | "user",
        public readonly id: UUID
    ) {}
}