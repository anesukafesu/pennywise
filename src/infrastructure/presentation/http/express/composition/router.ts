import { requireAuth } from "@infrastructure/presentation/http/express/middleware/requireAuth";
import { Router } from "express";
import { adaptController } from "@infrastructure/presentation/http/express/routing/adaptController";
import { createControllers } from "@infrastructure/presentation/http/express/composition/controllers";

export function createAppRouter(
  controllers: ReturnType<typeof createControllers>,
) {
  const router = Router();

  router.get("/", (req, res) => {
    res.json({ status: "ok" });
  });

  /* ---------- Auth ---------- */
  router.post(
    "/auth/sign-in",
    adaptController(controllers.signInWithEmailAndPassword),
  );

  router.post(
    "/auth/sign-up",
    adaptController(controllers.signUpWithEmailAndPassword),
  );

  router.use(requireAuth);

  /* ---------- Workspaces ---------- */
  router.post("/workspaces", adaptController(controllers.createWorkspace));

  router.get(
    "/workspaces",
    adaptController(controllers.listWorkspacesForActor),
  );

  router.patch(
    "/workspaces/:workspaceId",
    adaptController(controllers.updateWorkspace),
  );

  router.delete(
    "/workspaces/:workspaceId",
    adaptController(controllers.deleteWorkspace),
  );

  /* ---------- Budgets ---------- */
  router.post(
    "/workspaces/:workspaceId/budgets",
    adaptController(controllers.createBudget),
  );

  router.get(
    "/workspaces/:workspaceId/budgets",
    adaptController(controllers.listWorkspaceBudgets),
  );

  router.get("/budgets/:budgetId", adaptController(controllers.getBudget));

  router.patch("/budgets/:budgetId", adaptController(controllers.updateBudget));

  router.delete(
    "/budgets/:budgetId",
    adaptController(controllers.deleteBudget),
  );

  /* ---------- Budget Line Items ---------- */
  router.post(
    "/budgets/:budgetId/line-items",
    adaptController(controllers.createBudgetLineItem),
  );

  router.patch(
    "/line-items/:lineItemId",
    adaptController(controllers.updateBudgetLineItem),
  );

  router.delete(
    "/line-items/:lineItemId",
    adaptController(controllers.deleteBudgetLineItem),
  );

  /* ---------- Categories ---------- */
  router.post(
    "/workspaces/:workspaceId/categories",
    adaptController(controllers.createCategory),
  );

  router.get(
    "/workspaces/:workspaceId/categories",
    adaptController(controllers.listWorkspaceCategories),
  );

  router.patch(
    "/categories/:categoryId",
    adaptController(controllers.updateCategory),
  );

  router.delete(
    "/categories/:categoryId",
    adaptController(controllers.deleteCategory),
  );

  /* ---------- Invites & Collaborations ---------- */
  router.post(
    "/workspaces/:workspaceId/invites",
    adaptController(controllers.createInvite),
  );

  router.post(
    "/invites/:inviteId/accept",
    adaptController(controllers.acceptInvite),
  );

  router.post(
    "/invites/:inviteId/decline",
    adaptController(controllers.declineInvite),
  );

  router.delete(
    "/collaborations/:collaborationId",
    adaptController(controllers.deleteCollaboration),
  );

  router.post(
    "/workspaces/:workspaceId/transfer-ownership",
    adaptController(controllers.transferWorkspaceOwnership),
  );

  /* ---------- Reports ---------- */
  router.get(
    "/workspaces/:workspaceId/reports/budget-vs-actual/:year/:month",
    adaptController(controllers.getBudgetVsActualReport),
  );

  router.get(
    "/workspaces/:workspaceId/reports/income-expense/:year/:month",
    adaptController(controllers.getIncomeAndExpenseReport),
  );

  /* ---------- Transactions ---------- */
  router.post(
    "/workspaces/:workspaceId/transactions",
    adaptController(controllers.createTransaction),
  );

  router.get(
    "/workspaces/:workspaceId/transactions",
    adaptController(controllers.getWorkspaceTransactions),
  );

  router.patch(
    "/transactions/:transactionId",
    adaptController(controllers.updateTransaction),
  );

  router.delete(
    "/transactions/:transactionId",
    adaptController(controllers.deleteTransaction),
  );

  /* ---------- Users ---------- */
  router.get("/me", adaptController(controllers.getUserDetails));

  router.patch("/me", adaptController(controllers.updateUserDetails));

  router.delete("/me", adaptController(controllers.deleteUser));

  return router;
}
