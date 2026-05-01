# Pennywise

A backend service for a budgeting and expense-tracking application.

## Overview

Pennywise is the backend service for a budgeting and expense tracking application.
It provides APIs for managing users, budgets, accounts, and transactions.

The system is designed with a Clean Architecture approach and supports two persistence setups:

- **Appwrite TablesDB**
- **PostgreSQL**

Key features include:

- Expense and income tracking
- Budget creation and monitoring
- Workspace-based collaboration with other users
- Transaction history
- User account management
- Session-based authentication

---

## API Documentation

Detailed backend API documentation is available at [`docs/API.md`](docs/API.md).

---

## Setup Options

Choose one of the two setup modes below.

---

## Option A — Run with Appwrite TablesDB

### Development

1. Install Docker.
2. Clone this repository and `cd` into it.
3. Create env files:

```bash
cp .env.pennywise.example .env.pennywise
cp .env.appwrite.example .env.appwrite
```

4. Start Appwrite + Pennywise stack:

```bash
docker compose up
```

5. Open `http://localhost:8080` and create your Appwrite account/project.
6. Generate an Appwrite API key with full database access.
7. Update `.env.pennywise` values:
   - `APPWRITE_ENDPOINT=http://localhost:8080/v1`
   - `APPWRITE_PROJECT_ID=<your-project-id>`
   - `APPWRITE_API_KEY=<your-api-key>`
   - `SESSION_SECRET=<random-secret>`
   - `REDIS_URL=redis://pennywise-redis:6379`
8. Bootstrap Appwrite TablesDB:

```bash
npm run bootstrap
```

9. Restart containers:

```bash
docker compose down
docker compose up
```

### Production (Appwrite)

1. Create an Appwrite Cloud/self-hosted project.
2. Generate an API key with full access to database resources.
3. Configure `.env.pennywise` for your production Appwrite endpoint and keys.
4. Run Appwrite bootstrap:

```bash
npm run bootstrap
```

5. Build and run app image:

```bash
docker build -t pennywise-app .
docker run --env-file .env.pennywise -p 3000:3000 pennywise-app
```

> Appwrite bootstrap note: Appwrite resource creation is asynchronous. If bootstrap fails while creating indexes/columns, rerun `npm run bootstrap` (safe and idempotent).

---

## Option B — Run with PostgreSQL

### Development

1. Install Docker.
2. Clone this repository and `cd` into it.
3. Create `.env.pennywise` from example and fill required app settings:

```bash
cp .env.pennywise.example .env.pennywise
```

4. Start app + postgres + redis:

```bash
docker compose -f docker-compose.postgres.yml up
```

5. Bootstrap Postgres schema:

```bash
POSTGRES_CONNECTION_STRING=postgresql://pennywise:pennywise@localhost:5432/pennywise npm run bootstrap:postgres
```

6. If needed, restart the stack:

```bash
docker compose -f docker-compose.postgres.yml down
docker compose -f docker-compose.postgres.yml up
```

### Production (PostgreSQL)

1. Provision PostgreSQL and Redis instances.
2. Set `POSTGRES_CONNECTION_STRING` and `REDIS_URL` for the app.
3. Run Postgres bootstrap once against the target DB:

```bash
POSTGRES_CONNECTION_STRING=<your-production-connection-string> npm run bootstrap:postgres
```

4. Build and run app image:

```bash
docker build -t pennywise-app .
docker run --env-file .env.pennywise -p 3000:3000 pennywise-app
```

---

## Code Structure

The application follows **Clean Architecture** principles and is organized into three primary layers:

### Domain

Defines the **core entities** of the system and the fundamental business concepts.

### Application

Implements **use cases and business logic** involving domain entities.

This layer depends on abstractions for external services such as:

- repositories (data storage)
- email services
- other integrations

These abstractions are defined as interfaces inside:

```
src/application/ports
```

### Infrastructure

Provides **concrete implementations** of the interfaces defined in the application layer.

This layer also includes **presentation mechanisms** that expose the application's functionality to external clients.

Currently, the system exposes its functionality through a **REST API built with Express**.

## License

MIT License
