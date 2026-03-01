import {
  BudgetVsActualReportDTO,
  BudgetVsActualReportItem,
} from "@application/dtos/BudgetVsActualReportDTO";
import { NotFound } from "@application/errors/NotFound";
import { Actor } from "@entities/Actor";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { createBudgetVsActualReportItem } from "@application/mappers/createBudgetVsActualReportItem";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { UUID } from "node:crypto";

interface GetBudgetVsRealityReportDependencies {
  budgetRepository: BudgetRepository;
  budgetLineItemRepository: BudgetLineItemRepository;
  transactionRepository: TransactionRepository;
  categoryRepository: CategoryRepository;
  workspaceRepository: WorkspaceRepository;
  collaborationRepository: CollaborationRepository;
}

interface GetBudgetVsRealityReportInput {
  actor: Actor;
  details: {
    workspaceId: UUID;
    year: number;
    month: number;
  };
}

export class GetBudgetVsActualReportUseCase {
  constructor(
    private readonly dependencies: GetBudgetVsRealityReportDependencies,
  ) {}

  async execute({
    actor,
    details,
  }: GetBudgetVsRealityReportInput): Promise<BudgetVsActualReportDTO> {
    const {
      budgetRepository,
      budgetLineItemRepository,
      transactionRepository,
      categoryRepository,
      collaborationRepository,
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
      "Generate a budget vs actual report",
      collaborationRepository,
    );

    const budget = await budgetRepository.getOneByWorkspaceIdAndMonth(
      details.workspaceId,
      details.year,
      details.month,
    );

    if (!budget) {
      throw new NotFound("budget");
    }

    const budgetLineItems = await budgetLineItemRepository.getManyByBudgetId(
      budget.id,
    );

    const categoryTransactionTotals =
      await transactionRepository.getCategoryTotalsForMonth(
        details.workspaceId,
        details.year,
        details.month,
      );

    const categoryMap = await categoryRepository.getWorkspaceCategoriesAsMap(
      details.workspaceId,
    );

    const budgetVsRealityMap = new Map<UUID, BudgetVsActualReportItem>();

    for (const lineItem of budgetLineItems) {
      const reportItem = createBudgetVsActualReportItem(
        lineItem.categoryId,
        categoryMap,
        lineItem.amount,
        0,
      );

      budgetVsRealityMap.set(lineItem.categoryId, reportItem);
    }

    for (const actual of categoryTransactionTotals) {
      const entry = budgetVsRealityMap.get(actual.categoryId);
      if (entry) {
        entry.actualAmount = actual.total;
        continue;
      }

      const reportItem = createBudgetVsActualReportItem(
        actual.categoryId,
        categoryMap,
        actual.total,
        0,
      );

      budgetVsRealityMap.set(actual.categoryId, reportItem);
    }

    return {
      year: details.year,
      month: details.month,
      workspaceId: details.workspaceId,
      items: Array.from(budgetVsRealityMap.values()),
    };
  }
}
