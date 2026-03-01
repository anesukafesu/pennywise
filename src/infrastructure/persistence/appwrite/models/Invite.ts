import { Invite as InviteEntity } from "@entities/Invite";
import { Models } from "node-appwrite";

export interface InviteRowData extends Omit<InviteEntity, "id" | "userId" | "workspaceId" | "expiresOn"> {
    userId: string;
    workspaceId: string;
    expiresOn: string;
}

export interface AppwriteInviteRow extends Models.Row, InviteRowData {}