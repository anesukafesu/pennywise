import { UUID } from "node:crypto";

export type WorkspaceDTO = {
    id: UUID;
    name: string;
    description: string;
    dateCreated: string;
    currencyCode: string;
}