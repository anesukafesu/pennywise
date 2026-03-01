import { CategoryDTO } from "@application/dtos/CategoryDTO";
import { Actor } from "@entities/Actor";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { UUID } from "node:crypto";
import { Category } from "@entities/Category";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { InvalidInput } from "@domain/errors/InvalidInput";

interface UpdateCategoryDependencies {
  categoryRepository: CategoryRepository;
  collaborationRepository: CollaborationRepository;
}

interface UpdateCategoryInput {
  actor: Actor;
  details: {
    categoryId: UUID;
    name?: string;
    classification?: Category["classification"];
    subclassification?: Category["subclassification"];
  };
}

export class UpdateCategoryUseCase {
  constructor(private readonly dependencies: UpdateCategoryDependencies) {}

  async execute({ actor, details }: UpdateCategoryInput): Promise<CategoryDTO> {
    const { categoryRepository, collaborationRepository } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    if (Object.keys(details).length === 0) {
      throw new InvalidInput("Expected at least one field to update");
    }

    const category = await ensureResourceExists(
      "category",
      details.categoryId,
      categoryRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      category.workspaceId,
      "Update a category",
      collaborationRepository,
    );

    const updatedCategory = new Category(
      details.categoryId,
      category.workspaceId,
      details.name ?? category.name,
      details.classification ?? category.classification,
      details.subclassification ?? category.subclassification,
    );

    await categoryRepository.updateOne(updatedCategory);

    return updatedCategory;
  }
}
