import { UUID } from "node:crypto";

export class Invite {
    constructor(
        readonly id: UUID,
        readonly userId: UUID,
        readonly workspaceId: UUID,
        readonly expiresOn: Date,
    ) {}
}