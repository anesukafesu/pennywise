import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { Actor } from "@entities/Actor";
import { UUID } from "node:crypto";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";

export interface GetCategoriesDependencies {
  collaborationRepository: CollaborationRepository;
  categoryRepository: CategoryRepository;
  workspaceRepository: WorkspaceRepository;
}

export interface GetCategoriesInput {
  actor: Actor;
  details: {
    workspaceId: UUID;
  };
}

export class ListWorkspaceCategoriesUseCase {
  constructor(private readonly dependencies: GetCategoriesDependencies) {}

  async execute({ actor, details }: GetCategoriesInput) {
    const { collaborationRepository, categoryRepository, workspaceRepository } =
      this.dependencies;

    ensureActorIsAuthenticated(actor);

    await ensureResourceExists(
      "workspace",
      details.workspaceId,
      workspaceRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      details.workspaceId,
      "Read categories",
      collaborationRepository,
    );

    return categoryRepository.getManyByWorkspaceId(details.workspaceId);
  }
}
