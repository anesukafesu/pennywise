import { UUID } from "node:crypto";

export class Collaboration {
    constructor(
        public id: UUID,
        public userId: UUID,
        public workspaceId: UUID,
        public role: "owner" | "collaborator",
        public dateCreated: Date,
    ) {}
}