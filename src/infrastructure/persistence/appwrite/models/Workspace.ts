import { Workspace as WorkspaceEntity } from "@entities/Workspace";
import { Models } from "node-appwrite";

export interface WorkspaceRowData extends Omit<WorkspaceEntity, "id" | "dateCreated"> {
    dateCreated: string;
}

export interface AppwriteWorkspaceRow extends Models.Row, WorkspaceRowData {}