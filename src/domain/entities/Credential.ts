import { UUID } from "node:crypto";

export class Credential {
    constructor(
        public readonly id: UUID,
        public readonly userId: UUID,
        public readonly type: "email_password",
        public readonly identifier: string,
        public readonly secretHash: string
    ) {
    }
}