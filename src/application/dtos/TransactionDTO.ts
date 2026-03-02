import { UUID } from "node:crypto";

export interface TransactionDTO {
  id: UUID;
  workspaceId: UUID;
  date: Date;
  category: {
    id: UUID;
    name: string;
  };
  amount: number;
  notes: string;
  documentationUrl: string;
}
