import { IncomeAndExpenseReportDTO } from "@application/dtos/IncomeAndExpenseReportDTO";
import { NotFound } from "@application/errors/NotFound";
import { Actor } from "@entities/Actor";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { UUID } from "node:crypto";

interface GetIncomeAndExpenseReportDependencies {
  transactionRepository: TransactionRepository;
  categoryRepository: CategoryRepository;
  workspaceRepository: WorkspaceRepository;
  collaborationRepository: CollaborationRepository;
}

interface GetIncomeAndExpenseReportInput {
  actor: Actor;
  details: {
    workspaceId: UUID;
    year: number;
    month: number;
  };
}

export class GetIncomeAndExpenseReportUseCase {
  constructor(
    private readonly dependencies: GetIncomeAndExpenseReportDependencies,
  ) {}

  async execute({
    actor,
    details,
  }: GetIncomeAndExpenseReportInput): Promise<IncomeAndExpenseReportDTO> {
    const {
      transactionRepository,
      collaborationRepository,
      categoryRepository,
      workspaceRepository,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    await ensureResourceExists(
      "workspace",
      details.workspaceId,
      workspaceRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      details.workspaceId,
      "Generate an income and expense report",
      collaborationRepository,
    );

    const categoryTotals =
      await transactionRepository.getCategoryTotalsForMonth(
        details.workspaceId,
        details.year,
        details.month,
      );

    const categoryMap = await categoryRepository.getWorkspaceCategoriesAsMap(
      details.workspaceId,
    );

    const items = categoryTotals.map((entry) => {
      const category = categoryMap.get(entry.categoryId);

      if (!category) {
        throw new NotFound("category", entry.categoryId);
      }

      return {
        categoryId: entry.categoryId,
        categoryName: category.name,
        categoryClassification: category.classification,
        categorySubclassification: category.subclassification,
        amount: entry.total,
      };
    });

    return {
      workspaceId: details.workspaceId,
      year: details.year,
      month: details.month,
      items: items,
    };
  }
}
