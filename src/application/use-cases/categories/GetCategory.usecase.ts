import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { Actor } from "@domain/entities/Actor";
import { UUID } from "node:crypto";
import { CategoryDTO } from "@application/dtos/CategoryDTO";

interface GetCategoryDependencies {
  collaborationRepository: CollaborationRepository;
  categoryRepository: CategoryRepository;
}

interface GetCategoryInput {
  actor: Actor;
  details: {
    categoryId: UUID;
  };
}

export class GetCategoryUseCase {
  constructor(private dependencies: GetCategoryDependencies) {}

  async execute({
    actor,
    details: { categoryId },
  }: GetCategoryInput): Promise<CategoryDTO> {
    const { collaborationRepository, categoryRepository } = this.dependencies;

    const category = await ensureResourceExists(
      "category",
      categoryId,
      categoryRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      category.workspaceId,
      `Get category (${categoryId}).`,
      collaborationRepository,
    );

    return {
      id: category.id,
      workspaceId: category.workspaceId,
      name: category.name,
      classification: category.classification,
      subclassification: category.subclassification,
    };
  }
}
