import { UserDTO } from "./UserDTO";
import { UUID } from "node:crypto";
import { Collaboration } from "@domain/entities/Collaboration";

export interface CollaborationDTO {
  id: UUID;
  dateCreated: string;
  user: UserDTO;
  role: Collaboration["role"];
}
