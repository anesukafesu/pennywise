import { UUID } from "node:crypto";

export interface InviteDTO {
    id: UUID;
    userId: UUID;
    workspaceId: UUID;
    expiresOn: Date;
}