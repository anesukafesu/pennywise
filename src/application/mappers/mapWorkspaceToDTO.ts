import { WorkspaceDTO } from "@application/dtos/WorkspaceDTO";
import { Workspace } from "@entities/Workspace";

export function mapWorkspaceToDTO(workspace: Workspace): WorkspaceDTO {
  return {
    id: workspace.id,
    name: workspace.name,
    description: workspace.description,
    dateCreated: workspace.dateCreated.toISOString(),
    currencyCode: workspace.currencyCode,
  };
}
