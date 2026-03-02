import { UUID } from "node:crypto";

export interface InviteDTO {
  id: UUID;
  workspaceId: UUID;
  expiresOn: Date;
  user: {
    id: UUID;
    email: string;
    name: string;
    avatarUrl: string | null;
  };
}
