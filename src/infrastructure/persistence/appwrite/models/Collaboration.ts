import { Collaboration as CollaborationEntity } from "@entities/Collaboration"
import { Models } from "node-appwrite";

export interface CollaborationRowData extends Omit<CollaborationEntity, "id" | "workspaceId" | "userId" | "dateCreated"> {
    workspaceId: string;
    userId: string;
    dateCreated: string;
}

export interface AppwriteCollaborationRow extends Models.Row, CollaborationRowData {}