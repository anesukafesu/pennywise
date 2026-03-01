import { AppwriteInviteRow, InviteRowData } from "@appwrite-models/Invite";
import { toUUID } from "@domain/value-objects/toUUID";
import { Invite as InviteEntity } from "@entities/Invite";

export class InviteMapper {
    static toPersistence(invite: InviteEntity): InviteRowData {
        return {
            userId: invite.userId,
            workspaceId: invite.workspaceId,
            expiresOn: invite.expiresOn.toISOString(),
        }
    }

    static fromPersistence(invite: AppwriteInviteRow): InviteEntity {
        return new InviteEntity(
            toUUID(invite.$id),
            toUUID(invite.userId),
            toUUID(invite.workspaceId),
            new Date(invite.expiresOn)
        )
    }
}