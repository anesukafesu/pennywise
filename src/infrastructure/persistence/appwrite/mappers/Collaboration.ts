import { AppwriteCollaborationRow, CollaborationRowData } from "@appwrite-models/Collaboration";
import { toUUID } from "@domain/value-objects/toUUID";
import { Collaboration as CollaborationEntity } from "@entities/Collaboration";

export class CollaborationMapper {
    static toPersistence(collaboration: CollaborationEntity): CollaborationRowData {
        return {
            workspaceId: collaboration.workspaceId,
            userId: collaboration.userId,
            role: collaboration.role,
            dateCreated: collaboration.dateCreated.toISOString(),
        }
    }

    static fromPersistence(collaboration: AppwriteCollaborationRow): CollaborationEntity {
        return new CollaborationEntity(
            toUUID(collaboration.$id),
            toUUID(collaboration.userId),
            toUUID(collaboration.workspaceId),
            collaboration.role,
            new Date(collaboration.dateCreated),
        )

    }
}