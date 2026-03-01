import { WorkspaceDTO } from "@application/dtos/WorkspaceDTO";
import { NotFound } from "@application/errors/NotFound";
import { Actor } from "@entities/Actor";
import { Workspace } from "@entities/Workspace";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { InvalidInput } from "@domain/errors/InvalidInput";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { UUID } from "node:crypto";
import { ensureActorOwnsWorkspace } from "@application/guards/ensureActorOwnsWorkspace";

interface UpdateWorkspaceInputs {
  actor: Actor;
  details: {
    workspaceId: UUID;
    name?: string;
    description?: string;
    currencyCode?: string;
  };
}

interface UpdateWorkspaceDependencies {
  workspaceRepository: WorkspaceRepository;
  collaborationRepository: CollaborationRepository;
}

export class UpdateWorkspaceUseCase {
  private readonly dependencies: UpdateWorkspaceDependencies;

  constructor(dependencies: UpdateWorkspaceDependencies) {
    this.dependencies = dependencies;
  }

  async execute({
    actor,
    details,
  }: UpdateWorkspaceInputs): Promise<WorkspaceDTO> {
    const { workspaceRepository, collaborationRepository } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    if (details.name === undefined && details.description === undefined) {
      throw new InvalidInput("Expected either name or description.");
    }

    if (details.name !== undefined && details.name.trim() === "") {
      throw new InvalidInput("Workspace name cannot be empty.");
    }

    const workspace = await workspaceRepository.getOneById(details.workspaceId);

    if (!workspace) {
      throw new NotFound("workspace", details.workspaceId);
    }

    await ensureActorOwnsWorkspace(
      actor,
      details.workspaceId,
      `Update workspace (${details.workspaceId}) details.`,
      collaborationRepository,
    );

    const updatedWorkspace = new Workspace(
      details.workspaceId,
      details.name ?? workspace.name,
      details.description ?? workspace.description,
      workspace.dateCreated,
      details.currencyCode ?? workspace.currencyCode,
    );

    await workspaceRepository.updateOne(updatedWorkspace);

    return {
      ...updatedWorkspace,
      dateCreated: updatedWorkspace.dateCreated.toISOString(),
    };
  }
}
