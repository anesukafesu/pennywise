import { CategoryDTO } from "@application/dtos/CategoryDTO";
import { Actor } from "@entities/Actor";
import { Category } from "@entities/Category";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { IDGenerator } from "@application/ports/services/IDGenerator";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { UUID } from "node:crypto";

interface CreateCategoryDependencies {
  categoryRepository: CategoryRepository;
  collaborationRepository: CollaborationRepository;
  idGenerator: IDGenerator;
}

interface CreateCategoryInput {
  actor: Actor;
  details: {
    name: string;
    workspaceId: UUID;
    classification: Category["classification"];
    subclassification: Category["subclassification"];
  };
}

export class CreateCategoryUseCase {
  constructor(private readonly dependencies: CreateCategoryDependencies) {}

  async execute({ actor, details }: CreateCategoryInput): Promise<CategoryDTO> {
    const { categoryRepository, collaborationRepository, idGenerator } =
      this.dependencies;

    ensureActorIsAuthenticated(actor);

    await ensureActorHasAccessToWorkspace(
      actor,
      details.workspaceId,
      "Create a category",
      collaborationRepository,
    );

    const category = new Category(
      idGenerator.generate(),
      details.workspaceId,
      details.name,
      details.classification,
      details.subclassification,
    );

    await categoryRepository.createOne(category);

    return {
      ...category,
    };
  }
}
