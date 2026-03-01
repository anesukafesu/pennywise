export type Resource =
  | "credential"
  | "budget"
  | "budgetLineItem"
  | "category"
  | "collaboration"
  | "invite"
  | "transaction"
  | "user"
  | "workspace";

export type WorkspaceScopedResources =
  | "budget"
  | "category"
  | "collaboration"
  | "invite"
  | "transaction";

export interface WorkspaceScopedResource {
  workspaceId: string;
}
