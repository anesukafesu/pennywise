import { WorkspaceDTO } from "@application/dtos/WorkspaceDTO";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { mapWorkspaceToDTO } from "@application/mappers/mapWorkspaceToDTO";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { Actor } from "@entities/Actor";
import { UUID } from "node:crypto";

interface GetWorkspaceDependencies {
  workspaceRepository: WorkspaceRepository;
  collaborationRepository: CollaborationRepository;
}

interface GetWorkspaceInput {
  actor: Actor;
  details: {
    workspaceId: UUID;
  };
}

export class GetWorkspaceUseCase {
  constructor(private readonly dependencies: GetWorkspaceDependencies) {}

  async execute({ actor, details }: GetWorkspaceInput): Promise<WorkspaceDTO> {
    const { workspaceRepository, collaborationRepository } = this.dependencies;
    const workspace = await ensureResourceExists(
      "workspace",
      details.workspaceId,
      workspaceRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      workspace.id,
      "Get workspace",
      collaborationRepository,
    );

    return mapWorkspaceToDTO(workspace);
  }
}
