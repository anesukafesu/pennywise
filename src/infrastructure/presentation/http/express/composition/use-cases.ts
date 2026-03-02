import { createInfrastructure } from "@infrastructure/presentation/http/express/composition/infrastructure";
import { SignInWithEmailAndPasswordUseCase } from "@use-cases/auth/SignInWithEmailAndPassword";
import { SignUpWithEmailAndPasswordUseCase } from "@use-cases/auth/SignUpWithEmailAndPassword";
import { CreateBudgetUseCase } from "@use-cases/budgets/CreateBudget";
import { DeleteBudgetUseCase } from "@use-cases/budgets/DeleteBudget";
import { GetBudgetUseCase } from "@use-cases/budgets/GetBudget";
import { ListWorkspaceBudgetsUseCase } from "@use-cases/budgets/ListWorkspaceBudgets";
import { UpdateBudgetUseCase } from "@use-cases/budgets/UpdateBudget";
import { CreateBudgetLineItemUseCase } from "@use-cases/budget-line-items/CreateBudgetLineItem";
import { DeleteBudgetLineItemUseCase } from "@use-cases/budget-line-items/DeleteBudgetLineItem";
import { UpdateBudgetLineItemUseCase } from "@use-cases/budget-line-items/UpdateBudgetLineItem";
import { CreateCategoryUseCase } from "@use-cases/categories/CreateCategory";
import { DeleteCategoryUseCase } from "@use-cases/categories/DeleteCategory";
import { ListWorkspaceCategoriesUseCase } from "@use-cases/categories/ListWorkspaceCategories";
import { UpdateCategoryUseCase } from "@use-cases/categories/UpdateCategory";
import { AcceptInviteUseCase } from "@use-cases/invites-and-collaborations/AcceptInvite";
import { CreateInviteUseCase } from "@use-cases/invites-and-collaborations/CreateInvite";
import { DeclineInviteUseCase } from "@use-cases/invites-and-collaborations/DeclineInvite";
import { DeleteCollaborationUseCase } from "@use-cases/invites-and-collaborations/DeleteCollaboration";
import { TransferWorkspaceOwnershipUseCase } from "@use-cases/invites-and-collaborations/TransferWorkspaceOwnership";
import { GetBudgetVsActualReportUseCase } from "@use-cases/reports/GetBudgetVsActualReport";
import { GetIncomeAndExpenseReportUseCase } from "@use-cases/reports/GetIncomeAndExpenseReport";
import { CreateTransactionUseCase } from "@use-cases/transactions/CreateTransaction";
import { DeleteTransactionUseCase } from "@use-cases/transactions/DeleteTransaction";
import { GetWorkspaceTransactionsUseCase } from "@use-cases/transactions/GetWorkspaceTransactions";
import { UpdateTransactionUseCase } from "@use-cases/transactions/UpdateTransaction";
import { DeleteUserUseCase } from "@use-cases/users/DeleteUser";
import { GetUserDetailsUseCase } from "@use-cases/users/GetUserDetails";
import { UpdateUserDetailsUseCase } from "@use-cases/users/UpdateUserDetails";
import { CreateWorkspaceUseCase } from "@use-cases/workspaces/CreateWorkspace";
import { DeleteWorkspaceUseCase } from "@use-cases/workspaces/DeleteWorkspace";
import { ListWorkspacesForActorUseCase } from "@use-cases/workspaces/ListWorkspacesForActor";
import { UpdateWorkspaceUseCase } from "@use-cases/workspaces/UpdateWorkspace";

export function createUseCases({
  repositories,
  services,
}: ReturnType<typeof createInfrastructure>) {
  /* ---------- Auth ---------- */
  const authenticateUserWithEmailAndPassword =
    new SignInWithEmailAndPasswordUseCase({
      credentialRepository: repositories.credential,
      passwordHasher: services.passwordHasher,
    });

  const signUpWithEmailAndPassword = new SignUpWithEmailAndPasswordUseCase({
    credentialRepository: repositories.credential,
    userRepository: repositories.user,
    transactionRunner: services.transactionRunner,
    passwordHasher: services.passwordHasher,
    passwordPolicy: services.passwordPolicy,
    idGenerator: services.idGenerator,
  });

  /* ---------- Budgets ---------- */

  const createBudget = new CreateBudgetUseCase({
    budgetRepository: repositories.budget,
    collaborationRepository: repositories.collaboration,
    workspaceRepository: repositories.workspace,
    idGenerator: services.idGenerator,
  });

  const deleteBudget = new DeleteBudgetUseCase({
    budgetRepository: repositories.budget,
    budgetLineItemRepository: repositories.budgetLineItem,
    collaborationRepository: repositories.collaboration,
    transactionRunner: services.transactionRunner,
  });

  const getBudget = new GetBudgetUseCase({
    collaborationRepository: repositories.collaboration,
    budgetLineItemRepository: repositories.budgetLineItem,
    budgetRepository: repositories.budget,
    categoryRepository: repositories.category,
  });

  const listWorkspaceBudgets = new ListWorkspaceBudgetsUseCase({
    budgetRepository: repositories.budget,
    collaborationRepository: repositories.collaboration,
    workspaceRepository: repositories.workspace,
  });

  const updateBudget = new UpdateBudgetUseCase({
    budgetRepository: repositories.budget,
    collaborationRepository: repositories.collaboration,
  });

  /* ---------- Budget Line Items ---------- */

  const createBudgetLineItem = new CreateBudgetLineItemUseCase({
    budgetLineItemRepository: repositories.budgetLineItem,
    budgetRepository: repositories.budget,
    collaborationRepository: repositories.collaboration,
    categoryRepository: repositories.category,
    idGenerator: services.idGenerator,
  });

  const updateBudgetLineItem = new UpdateBudgetLineItemUseCase({
    categoryRepository: repositories.category,
    collaborationRepository: repositories.collaboration,
    budgetRepository: repositories.budget,
    budgetLineItemRepository: repositories.budgetLineItem,
  });

  const deleteBudgetLineItem = new DeleteBudgetLineItemUseCase({
    budgetLineItemRepository: repositories.budgetLineItem,
    budgetRepository: repositories.budget,
    collaborationRepository: repositories.collaboration,
  });

  /* ---------- Categories ---------- */

  const createCategory = new CreateCategoryUseCase({
    categoryRepository: repositories.category,
    collaborationRepository: repositories.collaboration,
    idGenerator: services.idGenerator,
  });

  const deleteCategory = new DeleteCategoryUseCase({
    categoryRepository: repositories.category,
    collaborationRepository: repositories.collaboration,
    transactionRepository: repositories.transaction,
    budgetLineItemRepository: repositories.budgetLineItem,
    transactionRunner: services.transactionRunner,
  });

  const listWorkspaceCategories = new ListWorkspaceCategoriesUseCase({
    collaborationRepository: repositories.collaboration,
    categoryRepository: repositories.category,
    workspaceRepository: repositories.workspace,
  });

  const updateCategory = new UpdateCategoryUseCase({
    categoryRepository: repositories.category,
    collaborationRepository: repositories.collaboration,
  });

  /* ---------- Invites & Collaborations ---------- */

  const createInvite = new CreateInviteUseCase({
    inviteRepository: repositories.invite,
    collaborationRepository: repositories.collaboration,
    workspaceRepository: repositories.workspace,
    userRepository: repositories.user,
    idGenerator: services.idGenerator,
  });

  const acceptInvite = new AcceptInviteUseCase({
    inviteRepository: repositories.invite,
    collaborationRepository: repositories.collaboration,
    idGenerator: services.idGenerator,
    transactionRunner: services.transactionRunner,
  });

  const declineInvite = new DeclineInviteUseCase({
    inviteRepository: repositories.invite,
  });

  const deleteCollaboration = new DeleteCollaborationUseCase({
    collaborationRepository: repositories.collaboration,
  });

  const transferWorkspaceOwnership = new TransferWorkspaceOwnershipUseCase({
    collaborationRepository: repositories.collaboration,
    transactionRunner: services.transactionRunner,
  });

  /* ---------- Reports ---------- */

  const getBudgetVsActualReport = new GetBudgetVsActualReportUseCase({
    budgetRepository: repositories.budget,
    budgetLineItemRepository: repositories.budgetLineItem,
    transactionRepository: repositories.transaction,
    categoryRepository: repositories.category,
    workspaceRepository: repositories.workspace,
    collaborationRepository: repositories.collaboration,
  });

  const getIncomeAndExpenseReport = new GetIncomeAndExpenseReportUseCase({
    transactionRepository: repositories.transaction,
    categoryRepository: repositories.category,
    workspaceRepository: repositories.workspace,
    collaborationRepository: repositories.collaboration,
  });

  /* ---------- Transactions ---------- */

  const createTransaction = new CreateTransactionUseCase({
    transactionRepository: repositories.transaction,
    collaborationRepository: repositories.collaboration,
    categoryRepository: repositories.category,
    idGenerator: services.idGenerator,
  });

  const deleteTransaction = new DeleteTransactionUseCase({
    transactionRepository: repositories.transaction,
    collaborationRepository: repositories.collaboration,
  });

  const getWorkspaceTransactions = new GetWorkspaceTransactionsUseCase({
    workspaceRepository: repositories.workspace,
    categoryRepository: repositories.category,
    transactionRepository: repositories.transaction,
    collaborationRepository: repositories.collaboration,
  });

  const updateTransaction = new UpdateTransactionUseCase({
    transactionRepository: repositories.transaction,
    categoryRepository: repositories.category,
    collaborationRepository: repositories.collaboration,
  });

  /* ---------- Users ---------- */

  const deleteUser = new DeleteUserUseCase({
    userRepository: repositories.user,
    collaborationRepository: repositories.collaboration,
    inviteRepository: repositories.invite,
    credentialRepository: repositories.credential,
    transactionRunner: services.transactionRunner,
  });

  const getUserDetails = new GetUserDetailsUseCase({
    userRepository: repositories.user,
  });

  const updateUserDetails = new UpdateUserDetailsUseCase({
    userRepository: repositories.user,
  });

  /* ---------- Workspaces ---------- */

  const createWorkspace = new CreateWorkspaceUseCase({
    idGenerator: services.idGenerator,
    transactionRunner: services.transactionRunner,
    workspaceRepository: repositories.workspace,
    userRepository: repositories.user,
    collaborationRepository: repositories.collaboration,
  });

  const deleteWorkspace = new DeleteWorkspaceUseCase({
    budgetLineItemRepository: repositories.budgetLineItem,
    budgetRepository: repositories.budget,
    categoryRepository: repositories.category,
    collaborationRepository: repositories.collaboration,
    inviteRepository: repositories.invite,
    transactionRepository: repositories.transaction,
    workspaceRepository: repositories.workspace,
    transactionRunner: services.transactionRunner,
  });

  const listWorkspacesForActor = new ListWorkspacesForActorUseCase({
    workspaceRepository: repositories.workspace,
    collaborationRepository: repositories.collaboration,
  });

  const updateWorkspace = new UpdateWorkspaceUseCase({
    workspaceRepository: repositories.workspace,
    collaborationRepository: repositories.collaboration,
  });

  return {
    authenticateUserWithEmailAndPassword,
    signUpWithEmailAndPassword,

    createBudget,
    deleteBudget,
    getBudget,
    listWorkspaceBudgets,
    updateBudget,

    createBudgetLineItem,
    updateBudgetLineItem,
    deleteBudgetLineItem,

    createCategory,
    deleteCategory,
    listWorkspaceCategories,
    updateCategory,

    createInvite,
    acceptInvite,
    declineInvite,
    deleteCollaboration,
    transferWorkspaceOwnership,

    getBudgetVsActualReport,
    getIncomeAndExpenseReport,

    createTransaction,
    deleteTransaction,
    getWorkspaceTransactions,
    updateTransaction,

    deleteUser,
    getUserDetails,
    updateUserDetails,

    createWorkspace,
    deleteWorkspace,
    listWorkspacesForActor,
    updateWorkspace,
  };
}
