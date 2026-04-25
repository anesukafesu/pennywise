import { SignInWithEmailAndPasswordController } from "@express-controllers/auth/SignInWithEmailAndPassword";
import { SignOutController } from "@express-controllers/auth/SignOut";
import { SignUpWithEmailAndPasswordController } from "@express-controllers/auth/SignUpWithEmailAndPassword";
import { CreateBudgetLineItemController } from "@express-controllers/budget-line-items/CreateBudgetLineItem";
import { DeleteBudgetLineItemController } from "@express-controllers/budget-line-items/DeleteBudgetLineItem";
import { UpdateBudgetLineItemController } from "@express-controllers/budget-line-items/UpdateBudgetLineItem";
import { CreateBudgetController } from "@express-controllers/budgets/CreateBudget";
import { DeleteBudgetController } from "@express-controllers/budgets/DeleteBudget";
import { GetBudgetController } from "@express-controllers/budgets/GetBudget";
import { ListWorkspaceBudgetsController } from "@express-controllers/budgets/ListWorkspaceBudgets";
import { UpdateBudgetController } from "@express-controllers/budgets/UpdateBudget";
import { CreateCategoryController } from "@express-controllers/categories/CreateCategory";
import { DeleteCategoryController } from "@express-controllers/categories/DeleteCategory";
import { ListWorkspaceCategoriesController } from "@express-controllers/categories/ListWorkspaceCategories";
import { UpdateCategoryController } from "@express-controllers/categories/UpdateCategory";
import { AcceptInviteController } from "@express-controllers/invites-and-collaborations/AcceptInvite";
import { CreateInviteController } from "@express-controllers/invites-and-collaborations/CreateInvite";
import { DeclineInviteController } from "@express-controllers/invites-and-collaborations/DeclineInvite";
import { DeleteCollaborationController } from "@express-controllers/invites-and-collaborations/DeleteCollaboration";
import { GetIncomingInvitesController } from "@express-controllers/invites-and-collaborations/GetIncomingInvites";
import { GetWorkspaceCollaborationsController } from "@express-controllers/invites-and-collaborations/GetWorkspaceCollaborations";
import { GetWorkspaceInvitesController } from "@express-controllers/invites-and-collaborations/GetWorkspaceInvites";
import { TransferWorkspaceOwnershipController } from "@express-controllers/invites-and-collaborations/TransferWorkspaceOwnership";
import { GetBudgetVsActualReportController } from "@express-controllers/reports/GetBudgetVsActualReport";
import { GetIncomeAndExpenseReportController } from "@express-controllers/reports/GetIncomeAndExpenseReport";
import { CreateTransactionController } from "@express-controllers/transactions/CreateTransaction";
import { DeleteTransactionController } from "@express-controllers/transactions/DeleteTransaction";
import { GetWorkspaceTransactionsController } from "@express-controllers/transactions/GetWorkspaceTransactions";
import { UpdateTransactionController } from "@express-controllers/transactions/UpdateTransaction";
import { DeleteUserController } from "@express-controllers/users/DeleteUser";
import { GetUserDetailsController } from "@express-controllers/users/GetUserDetails";
import { UpdateUserDetailsController } from "@express-controllers/users/UpdateUserDetails";
import { CreateWorkspaceController } from "@express-controllers/workspaces/CreateWorkspace";
import { DeleteWorkspaceController } from "@express-controllers/workspaces/DeleteWorkspace";
import { ListWorkspacesForActorController } from "@express-controllers/workspaces/ListWorkspacesForActor";
import { UpdateWorkspaceController } from "@express-controllers/workspaces/UpdateWorkspace";
import { createUseCases } from "@infrastructure/presentation/http/express/composition/use-cases";

export function createControllers(useCases: ReturnType<typeof createUseCases>) {
  return {
    /* ---------- Auth ---------- */
    signInWithEmailAndPassword: new SignInWithEmailAndPasswordController(
      useCases.authenticateUserWithEmailAndPassword,
    ),

    signUpWithEmailAndPassword: new SignUpWithEmailAndPasswordController(
      useCases.signUpWithEmailAndPassword,
    ),

    signOut: new SignOutController(),

    /* ---------- Budgets ---------- */
    createBudget: new CreateBudgetController(useCases.createBudget),

    deleteBudget: new DeleteBudgetController(useCases.deleteBudget),

    getBudget: new GetBudgetController(useCases.getBudget),

    listWorkspaceBudgets: new ListWorkspaceBudgetsController(
      useCases.listWorkspaceBudgets,
    ),

    updateBudget: new UpdateBudgetController(useCases.updateBudget),

    /* ---------- Budget Line Items ---------- */
    createBudgetLineItem: new CreateBudgetLineItemController(
      useCases.createBudgetLineItem,
    ),

    updateBudgetLineItem: new UpdateBudgetLineItemController(
      useCases.updateBudgetLineItem,
    ),

    deleteBudgetLineItem: new DeleteBudgetLineItemController(
      useCases.deleteBudgetLineItem,
    ),

    /* ---------- Categories ---------- */
    createCategory: new CreateCategoryController(useCases.createCategory),

    deleteCategory: new DeleteCategoryController(useCases.deleteCategory),

    listWorkspaceCategories: new ListWorkspaceCategoriesController(
      useCases.listWorkspaceCategories,
    ),

    updateCategory: new UpdateCategoryController(useCases.updateCategory),

    /* ---------- Invites & Collaborations ---------- */
    createInvite: new CreateInviteController(useCases.createInvite),

    acceptInvite: new AcceptInviteController(useCases.acceptInvite),

    declineInvite: new DeclineInviteController(useCases.declineInvite),

    deleteCollaboration: new DeleteCollaborationController(
      useCases.deleteCollaboration,
    ),

    transferWorkspaceOwnership: new TransferWorkspaceOwnershipController(
      useCases.transferWorkspaceOwnership,
    ),

    getIncomingInvites: new GetIncomingInvitesController(
      useCases.getIncomingInvites,
    ),

    getWorkspaceCollaborators: new GetWorkspaceCollaborationsController(
      useCases.getWorkspaceCollaborations,
    ),

    getWorkspaceInvites: new GetWorkspaceInvitesController(
      useCases.getWorkspaceInvites,
    ),

    /* ---------- Reports ---------- */
    getBudgetVsActualReport: new GetBudgetVsActualReportController(
      useCases.getBudgetVsActualReport,
    ),

    getIncomeAndExpenseReport: new GetIncomeAndExpenseReportController(
      useCases.getIncomeAndExpenseReport,
    ),

    /* ---------- Transactions ---------- */
    createTransaction: new CreateTransactionController(
      useCases.createTransaction,
    ),

    deleteTransaction: new DeleteTransactionController(
      useCases.deleteTransaction,
    ),

    getWorkspaceTransactions: new GetWorkspaceTransactionsController(
      useCases.getWorkspaceTransactions,
    ),

    updateTransaction: new UpdateTransactionController(
      useCases.updateTransaction,
    ),

    /* ---------- Users ---------- */
    deleteUser: new DeleteUserController(useCases.deleteUser),

    getUserDetails: new GetUserDetailsController(useCases.getUserDetails),

    updateUserDetails: new UpdateUserDetailsController(
      useCases.updateUserDetails,
    ),

    /* ---------- Workspaces ---------- */
    createWorkspace: new CreateWorkspaceController(useCases.createWorkspace),

    deleteWorkspace: new DeleteWorkspaceController(useCases.deleteWorkspace),

    listWorkspacesForActor: new ListWorkspacesForActorController(
      useCases.listWorkspacesForActor,
    ),

    updateWorkspace: new UpdateWorkspaceController(useCases.updateWorkspace),
  };
}
