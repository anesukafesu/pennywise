# Pennywise Backend API Documentation

This document describes the HTTP API exposed by the Express router in `src/infrastructure/presentation/http/express/composition/router.ts`.

## Base URL

- Local development: `http://localhost:3000`

## Content type

- Request bodies: `application/json`
- Responses: `application/json` unless the endpoint returns `204 No Content`

## Authentication model

Pennywise uses **session-based authentication**:

1. Call `POST /auth/sign-up` or `POST /auth/sign-in`.
2. On success, the server stores actor information in the session and sets a session cookie.
3. All routes except `/` and auth routes require an authenticated session.

Session middleware configuration:

- Cookie name: `pennywise.sid`
- Store: Redis-backed session store

## Global error responses

Most handlers are wrapped by a controller adapter that maps known domain/application errors to HTTP status codes:

- `400 Bad Request` — invalid input
- `401 Unauthorized` — unauthenticated
- `403 Forbidden` — lacks permission
- `404 Not Found` — resource does not exist
- `409 Conflict` — resource conflict
- `410 Gone` — expired resources (for example, expired invite)
- `500 Internal Server Error` — unhandled errors

Error response shape:

```json
{
  "error": "Human-readable error message"
}
```

---

## Health

### `GET /`
Returns a simple health payload.

**Response `200`**

```json
{
  "status": "ok"
}
```

---

## Auth

### `POST /auth/sign-up`
Create an account and start an authenticated session.

**Body**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "A-strong-password"
}
```

**Response `200`**

```json
{
  "id": "uuid",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### `POST /auth/sign-in`
Sign in with existing credentials and start an authenticated session.

**Body**

```json
{
  "email": "jane@example.com",
  "password": "A-strong-password"
}
```

**Response `204`**
No response body.

### `POST /auth/sign-out`
Destroy the current authenticated session and clear the session cookie.

**Response `204`**
No response body.

---

## Users

### `GET /me`
Get current authenticated user details.

**Response `200`**

```json
{
  "id": "uuid",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "avatarUrl": "https://..."
}
```

### `PATCH /me`
Update current user profile.

**Body**

```json
{
  "name": "Jane Q. Doe",
  "avatarUrl": "https://..."
}
```

**Response `200`**
Same shape as `GET /me`.

### `DELETE /me`
Delete current user and destroy the session.

**Response `204`**
No response body.

---

## Workspaces

### `POST /workspaces`
Create a workspace.

**Body**

```json
{
  "name": "Personal Finance",
  "description": "My personal budget",
  "currencyCode": "USD"
}
```

**Response `201`**

```json
{
  "id": "uuid",
  "name": "Personal Finance",
  "description": "My personal budget",
  "currencyCode": "USD",
  "dateCreated": "2026-04-21T00:00:00.000Z"
}
```

### `GET /workspaces`
List workspaces available to the current actor.

**Response `200`**
Array of workspace objects (same shape as above).

### `PATCH /workspaces/:workspaceId`
Update a workspace.

**Body**

```json
{
  "name": "Updated workspace name",
  "description": "Updated description",
  "currencyCode": "USD"
}
```

**Response `200`**
Updated workspace object.

### `DELETE /workspaces/:workspaceId`
Delete a workspace.

**Response `204`**
No response body.

---

## Budgets

### `POST /workspaces/:workspaceId/budgets`
Create a budget for a workspace/month.

**Body**

```json
{
  "year": 2026,
  "month": 4
}
```

**Response `201`**
Budget summary:

```json
{
  "id": "uuid",
  "year": 2026,
  "month": 4,
  "workspaceId": "uuid"
}
```

### `GET /workspaces/:workspaceId/budgets`
List budgets for a workspace.

**Response `200`**
Array of budget summaries.

### `GET /budgets/:budgetId`
Get budget details including line items.

**Response `200`**

```json
{
  "id": "uuid",
  "year": 2026,
  "month": 4,
  "workspaceId": "uuid",
  "budgetLineItems": [
    {
      "id": "uuid",
      "categoryId": "uuid",
      "categoryName": "Groceries",
      "amount": 500
    }
  ]
}
```

### `PATCH /budgets/:budgetId`
Update budget metadata.

**Body**
No request body fields are currently consumed by the controller.

**Response `200`**
Updated budget summary.

### `DELETE /budgets/:budgetId`
Delete a budget.

**Body**
No body required.

**Response `204`**
No response body.

---

## Budget line items

### `POST /budgets/:budgetId/line-items`
Create a budget line item.

**Body**

```json
{
  "categoryId": "uuid",
  "amount": 500
}
```

**Response `200`**

```json
{
  "id": "uuid",
  "categoryId": "uuid",
  "categoryName": "Groceries",
  "amount": 500
}
```

### `PATCH /line-items/:lineItemId`
Update a budget line item.

**Body**

```json
{
  "categoryId": "uuid",
  "amount": 550
}
```

**Response `200`**
Updated line item object.

### `DELETE /line-items/:lineItemId`
Delete a budget line item.

**Response `204`**
No response body.


---

## Categories

### `POST /workspaces/:workspaceId/categories`
Create a category.

**Body**

```json
{
  "name": "Salary",
  "workspaceId": "uuid",
  "classification": "income",
  "subclassification": "salary"
}
```

**Response `201`**

```json
{
  "id": "uuid",
  "name": "Salary",
  "workspaceId": "uuid",
  "classification": "income",
  "subclassification": "salary"
}
```

### `GET /workspaces/:workspaceId/categories`
List categories in a workspace.

**Response `200`**
Array of category objects.

### `PATCH /categories/:categoryId`
Update a category.

**Body**

```json
{
  "name": "Food",
  "classification": "expense",
  "subclassification": "groceries"
}
```

**Response `200`**
Updated category object.

### `DELETE /categories/:categoryId`
Delete a category.

**Response `204`**
No response body.

---

## Invites and collaborations

### `GET /invites`
List incoming invites for the current user.

**Response `200`**
Array of invite objects.

### `GET /workspaces/:workspaceId/collaborators`
List collaborators in a workspace.

**Response `200`**
Array of collaboration objects.

### `GET /workspaces/:workspaceId/invites`
List invites sent for a workspace (owner-only).

**Response `200`**
Array of invite objects.

### `POST /workspaces/:workspaceId/invites`
Create an invite.

**Body**

Preferred:

```json
{
  "inviteeEmail": "invitee@example.com"
}
```

Alternative (compatibility):

```json
{
  "inviteeId": "uuid"
}
```

If both fields are provided, the API returns `400`.

**Response `201`**

```json
{
  "id": "uuid",
  "workspaceId": "uuid",
  "expiresOn": "2026-04-28T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "invitee@example.com",
    "name": "Invitee",
    "avatarUrl": null
  }
}
```

### `POST /invites/:inviteId/accept`
Accept an invite.

**Response `204`**
No response body.

### `POST /invites/:inviteId/decline`
Decline an invite.

**Response `204`**
No response body.

### `DELETE /collaborations/:collaborationId`
Remove a collaboration.

**Response `204`**
No response body.

### `POST /workspaces/:workspaceId/transfer-ownership`
Transfer workspace ownership.

**Body**

```json
{
  "successorId": "uuid"
}
```

**Response `204`**
No response body.

---

## Transactions

### `POST /workspaces/:workspaceId/transactions`
Create a transaction.

**Body**

```json
{
  "date": "2026-04-21",
  "categoryId": "uuid",
  "amount": 42.5,
  "notes": "Lunch",
  "documentationUrl": "https://example.com/receipt"
}
```

**Response `201`**

```json
{
  "id": "uuid",
  "workspaceId": "uuid",
  "date": "2026-04-21T00:00:00.000Z",
  "category": {
    "id": "uuid",
    "name": "Food"
  },
  "amount": 42.5,
  "notes": "Lunch",
  "documentationUrl": "https://example.com/receipt"
}
```

### `GET /workspaces/:workspaceId/transactions`
List transactions for a workspace.

**Response `200`**
Array of transaction objects.

### `PATCH /transactions/:transactionId`
Update a transaction.

**Body**

```json
{
  "date": "2026-04-22",
  "categoryId": "uuid",
  "amount": 40,
  "notes": "Updated notes",
  "documentationUrl": "https://example.com/new-receipt"
}
```

All fields are optional.

**Response `200`**
Updated transaction object.

### `DELETE /transactions/:transactionId`
Delete a transaction.

**Response `204`**
No response body.

---

## Reports

### `GET /workspaces/:workspaceId/reports/budget-vs-actual`
Get budget-vs-actual report.

**Query parameters (canonical)**

- `year` (integer, 4-digit, range 1900-3000)
- `month` (integer, 1-12)

Example: `GET /workspaces/:workspaceId/reports/budget-vs-actual?year=2026&month=4`

Compatibility route also supported: `GET /workspaces/:workspaceId/reports/budget-vs-actual/:year/:month`

**Response `200`**

```json
{
  "workspaceId": "uuid",
  "year": 2026,
  "month": 4,
  "items": [
    {
      "categoryId": "uuid",
      "categoryName": "Groceries",
      "categoryClassification": "expense",
      "categorySubclassification": "groceries",
      "budgetedAmount": 500,
      "actualAmount": 420
    }
  ]
}
```

### `GET /workspaces/:workspaceId/reports/income-expense`
Get income-and-expense report.

**Query parameters (canonical)**

- `year` (integer, 4-digit, range 1900-3000)
- `month` (integer, 1-12)

Example: `GET /workspaces/:workspaceId/reports/income-expense?year=2026&month=4`

Compatibility route also supported: `GET /workspaces/:workspaceId/reports/income-expense/:year/:month`

**Response `200`**

```json
{
  "workspaceId": "uuid",
  "year": 2026,
  "month": 4,
  "items": [
    {
      "categoryId": "uuid",
      "categoryName": "Salary",
      "categoryClassification": "income",
      "categorySubclassification": "salary",
      "amount": 5000
    }
  ]
}
```

