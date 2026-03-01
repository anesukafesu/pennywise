import { Client, IndexType, TablesDB } from "node-appwrite";
import "dotenv/config";

const DATABASE_ID = process.env.DATABASE_ID!;

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const tablesDB = new TablesDB(client);

async function ensureDatabase(databaseId: string, name: string) {
  try {
    await tablesDB.get({ databaseId });
    console.log(`✓ Database '${databaseId}' already exists`);
  } catch {
    await tablesDB.create({ databaseId, name });
    console.log(`＋ Created database '${databaseId}'`);
  }
}

async function ensureTable(params: {
  databaseId: string;
  tableId: string;
  name: string;
  columns: any[];
  indexes?: any[];
}) {
  const { databaseId, tableId, name, columns, indexes } = params;

  try {
    await tablesDB.getTable({ databaseId, tableId });
    console.log(`✓ Table '${tableId}' already exists`);
  } catch {
    await tablesDB.createTable({ databaseId, tableId, name });
    console.log(`＋ Created table '${tableId}'`);
  }

  for (const column of columns) {
    await ensureColumn({ databaseId, tableId, column });
  }

  if (indexes) {
    for (const index of indexes) {
      await ensureIndex({ databaseId, tableId, index });
    }
  }
}

async function ensureColumn(params: {
  databaseId: string;
  tableId: string;
  column: {
    key: string;
    type: string;
    size?: number;
    required: boolean;
    elements?: string[];
  };
}) {
  const { databaseId, tableId, column } = params;

  try {
    await tablesDB.getColumn({ databaseId, tableId, key: column.key });
    console.log(
      `✓ Column '${column.key}' already exists on table '${tableId}'`,
    );
  } catch {
    const columnCreators: Record<string, (args: any) => Promise<any>> = {
      string: (args) => tablesDB.createStringColumn(args),
      email: (args) => tablesDB.createEmailColumn(args),
      enum: (args) => tablesDB.createEnumColumn(args),
      integer: (args) => tablesDB.createIntegerColumn(args),
      float: (args) => tablesDB.createFloatColumn(args),
      boolean: (args) => tablesDB.createBooleanColumn(args),
      ip: (args) => tablesDB.createIpColumn(args),
    };

    const fn = columnCreators[column.type];
    if (!fn) throw new Error(`Unsupported column type: ${column.type}`);

    const args: any = {
      databaseId,
      tableId,
      key: column.key,
      required: column.required,
    };

    if (column.size) args.size = column.size;
    if (column.elements) args.elements = column.elements;

    await fn(args);
    console.log(`＋ Created column '${column.key}' on table '${tableId}'`);
  }
}

async function ensureIndex(params: {
  databaseId: string;
  tableId: string;
  index: {
    key: string;
    type: IndexType;
    columns: string[];
  };
}) {
  const { databaseId, tableId, index } = params;

  try {
    await tablesDB.getIndex({ databaseId, tableId, key: index.key });
    console.log(`✓ Index '${index.key}' already exists on table '${tableId}'`);
  } catch {
    await tablesDB.createIndex({
      databaseId,
      tableId,
      key: index.key,
      type: index.type,
      columns: index.columns,
    });
    console.log(`＋ Created index '${index.key}' on table '${tableId}'`);
  }
}

async function bootstrap() {
  await ensureDatabase(DATABASE_ID, "Pennywise");

  // USERS
  await ensureTable({
    databaseId: DATABASE_ID,
    tableId: "users",
    name: "users",
    columns: [
      { key: "name", type: "string", size: 128, required: true },
      { key: "email", type: "email", required: true },
      { key: "avatarUrl", type: "string", size: 256, required: true },
    ],
    indexes: [{ key: "email_unique", type: "unique", columns: ["email"] }],
  });

  // WORKSPACES
  await ensureTable({
    databaseId: DATABASE_ID,
    tableId: "workspaces",
    name: "workspaces",
    columns: [
      { key: "name", type: "string", size: 128, required: true },
      { key: "description", type: "string", size: 512, required: true },
      { key: "dateCreated", type: "string", size: 512, required: true },
      { key: "currencyCode", type: "string", size: 3, required: true },
    ],
  });

  // COLLABORATIONS
  await ensureTable({
    databaseId: DATABASE_ID,
    tableId: "collaborations",
    name: "collaborations",
    columns: [
      { key: "userId", type: "string", size: 64, required: true },
      { key: "workspaceId", type: "string", size: 64, required: true },
      {
        key: "role",
        type: "enum",
        elements: ["owner", "collaborator"],
        required: true,
      },
      { key: "dateCreated", type: "string", size: 64, required: true },
    ],
    indexes: [
      {
        key: "user_workspace_unique",
        type: "unique",
        columns: ["userId", "workspaceId"],
      },
    ],
  });

  // CATEGORIES
  await ensureTable({
    databaseId: DATABASE_ID,
    tableId: "categories",
    name: "categories",
    columns: [
      { key: "workspaceId", type: "string", size: 64, required: true },
      { key: "name", type: "string", size: 128, required: true },
      {
        key: "classification",
        type: "enum",
        elements: ["income", "expense"],
        required: true,
      },
      {
        key: "subclassification",
        type: "enum",
        elements: ["regular", "irregular", "fixed", "fun", "future"],
        required: true,
      },
    ],
  });

  // BUDGETS
  await ensureTable({
    databaseId: DATABASE_ID,
    tableId: "budgets",
    name: "budgets",
    columns: [
      { key: "workspaceId", type: "string", size: 64, required: true },
      { key: "year", type: "integer", required: true },
      { key: "month", type: "integer", required: true },
    ],
    indexes: [
      {
        key: "workspace_year_month_unique",
        type: "unique",
        columns: ["workspaceId", "year", "month"],
      },
    ],
  });

  // BUDGET LINE ITEMS
  await ensureTable({
    databaseId: DATABASE_ID,
    tableId: "budget_line_items",
    name: "budget_line_items",
    columns: [
      { key: "budgetId", type: "string", size: 64, required: true },
      { key: "categoryId", type: "string", size: 64, required: true },
      { key: "amount", type: "float", required: true },
    ],
    indexes: [
      {
        key: "budget_category_unique",
        type: "unique",
        columns: ["budgetId", "categoryId"],
      },
    ],
  });

  // TRANSACTIONS
  await ensureTable({
    databaseId: DATABASE_ID,
    tableId: "transactions",
    name: "transactions",
    columns: [
      { key: "workspaceId", type: "string", size: 64, required: true },
      { key: "date", type: "string", size: 64, required: true },
      { key: "categoryId", type: "string", size: 64, required: true },
      { key: "amount", type: "float", required: true },
      { key: "notes", type: "string", size: 512, required: true },
      { key: "documentationUrl", type: "string", size: 512, required: true },
    ],
  });

  // CREDENTIALS
  await ensureTable({
    databaseId: DATABASE_ID,
    tableId: "credentials",
    name: "credentials",
    columns: [
      { key: "userId", type: "string", size: 64, required: true },
      {
        key: "type",
        type: "enum",
        elements: ["email_password"],
        required: true,
      },
      { key: "identifier", type: "string", size: 128, required: true },
      { key: "secretHash", type: "string", size: 256, required: true },
    ],
    indexes: [
      { key: "identifier_unique", type: "unique", columns: ["identifier"] },
    ],
  });

  // INVITES
  await ensureTable({
    databaseId: DATABASE_ID,
    tableId: "invites",
    name: "invites",
    columns: [
      { key: "userId", type: "string", size: 64, required: true },
      { key: "workspaceId", type: "string", size: 64, required: true },
      { key: "expiresOn", type: "string", size: 64, required: true },
    ],
  });

  console.log("✔ Pennywise Appwrite bootstrap complete");
}

bootstrap().catch((err) => {
  console.error("✖ Bootstrap failed", err);
  process.exit(1);
});
