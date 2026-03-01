import { AppwriteWorkspaceRow, WorkspaceRowData } from "@appwrite-models/Workspace";
import { toUUID } from "@domain/value-objects/toUUID";
import { Workspace as WorkspaceEntity } from "@entities/Workspace";

export class WorkspaceMapper {
    static toPersistence(workspace: WorkspaceEntity): WorkspaceRowData {
        return {
            name: workspace.name,
            description: workspace.description,
            dateCreated: workspace.dateCreated.toISOString(),
            currencyCode: workspace.currencyCode,
        }
    }

    static fromPersistence(workspace: AppwriteWorkspaceRow): WorkspaceEntity {
        return new WorkspaceEntity(
            toUUID(workspace.$id),
            workspace.name,
            workspace.description,
            new Date(workspace.dateCreated),
            workspace.currencyCode,
        )
    }
}