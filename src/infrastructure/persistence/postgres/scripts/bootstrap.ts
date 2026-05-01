import { execFileSync } from "node:child_process";
import "dotenv/config";

const connectionString = process.env.POSTGRES_CONNECTION_STRING;

if (!connectionString) {
  console.error("✖ Missing POSTGRES_CONNECTION_STRING");
  process.exit(1);
}

const sql = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  avatar_url VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description VARCHAR(512) NOT NULL,
  date_created TIMESTAMPTZ NOT NULL,
  currency_code CHAR(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS collaborations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  role VARCHAR(32) NOT NULL CHECK (role IN ('owner','collaborator')),
  date_created TIMESTAMPTZ NOT NULL,
  UNIQUE(user_id, workspace_id)
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(128) NOT NULL,
  classification VARCHAR(16) NOT NULL CHECK (classification IN ('income','expense')),
  subclassification VARCHAR(16) NOT NULL CHECK (subclassification IN ('regular','irregular','fixed','fun','future'))
);

CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  UNIQUE(workspace_id, year, month)
);

CREATE TABLE IF NOT EXISTS budget_line_items (
  id UUID PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  amount DOUBLE PRECISION NOT NULL,
  UNIQUE(budget_id, category_id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  amount DOUBLE PRECISION NOT NULL,
  notes VARCHAR(512) NOT NULL,
  documentation_url VARCHAR(512) NOT NULL
);

CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(32) NOT NULL CHECK (type IN ('email_password')),
  identifier VARCHAR(128) NOT NULL UNIQUE,
  secret_hash VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  expires_on TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_collaborations_user_id ON collaborations(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_workspace_id ON collaborations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_categories_workspace_id ON categories(workspace_id);
CREATE INDEX IF NOT EXISTS idx_budgets_workspace_id ON budgets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_budget_line_items_budget_id ON budget_line_items(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_line_items_category_id ON budget_line_items(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_workspace_id ON transactions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_invites_user_id ON invites(user_id);
CREATE INDEX IF NOT EXISTS idx_invites_workspace_id ON invites(workspace_id);
`;

try {
  execFileSync("psql", [connectionString, "-v", "ON_ERROR_STOP=1", "-c", sql], {
    stdio: "inherit",
  });

  console.log("✔ Pennywise Postgres bootstrap complete");
} catch (error) {
  console.error("✖ Bootstrap failed", error);
  process.exit(1);
}
