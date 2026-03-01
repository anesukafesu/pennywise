import { UUID } from "node:crypto";

export interface UserDTO {
    id: UUID;
    name: string;
    email: string;
    avatarUrl: string;
}