# Pennywise

A backend service for a budgeting and expense-tracking application.

## Overview

Pennywise is the backend service for a budgeting and expense tracking application.
It provides APIs for managing users, budgets, accounts, and transactions.

The system is designed with a Clean Architecture approach and integrates with
Appwrite for authentication and database storage.

Key features include:

- Expense and income tracking
- Budget creation and monitoring
- Workspace-based collaboration with other users
- Transaction history
- User account management
- Session-based authentication

---

# Production Setup

1. Create an Appwrite Cloud account.
2. Create a new project.
3. Generate an API key with **full access to the database service**.
4. Install Docker on your production machine.
5. Clone this repository and navigate to the root directory.
6. Run the bootstrap script to initialize the database:

```bash
npm run bootstrap
```

7. Copy `.env.pennywise.example` to `.env.pennywise` and provide values for all required environment variables.
8. Build the Docker image:

```bash
docker build -t pennywise-app .
```

9. Run the container:

```bash
docker run pennywise-app
```

> **Note about the bootstrap script**

When Appwrite creates collections or attributes, the underlying work is handled asynchronously by background workers. As a result, Appwrite may return an HTTP `201` response before the resources are fully available.

Because of this, the bootstrap script may fail when attempting to create indexes on attributes that have not yet finished initializing.

The script is **idempotent**, meaning it can be safely re-run multiple times. If it fails, simply run the script again until all database resources are successfully created.

A more robust solution for this behavior is still being explored.

---

# Development Setup

1. Install Docker on your machine.
2. Clone the repository and navigate to the project directory.
3. Create the required environment files:

```bash
cp .env.pennywise.example .env.pennywise
cp .env.appwrite.example .env.appwrite
```

4. Start the development environment:

```bash
docker compose up
```

This will start both Appwrite and the Pennywise backend.

5. Open **http://localhost:8080** in your browser.
6. Create an Appwrite account.
7. Create a project and generate an API key with **full database access**.
8. Configure your `.env.pennywise` file:

- **APPWRITE_ENDPOINT**: `http://localhost:8080/v1`
- **APPWRITE_PROJECT_ID**: Found in the Appwrite console.
- **APPWRITE_API_KEY**: The API key generated in step 7.
- **SESSION_SECRET**: A random string used by `express-session` to secure session handling.
- **REDIS_URL**: `redis://pennywise-redis:6379`

9. Initialize the database:

```bash
npm run bootstrap
```

Refer to the bootstrap note in the production section regarding asynchronous resource creation.

10. Restart the containers:

```bash
docker compose down
docker compose up
```

The application should now be fully operational.

Hot reloading is enabled during development.

---

# Code Structure

The application follows **Clean Architecture** principles and is organized into three primary layers:

## Domain

Defines the **core entities** of the system and the fundamental business concepts.

## Application

Implements **use cases and business logic** involving domain entities.

This layer depends on abstractions for external services such as:

- repositories (data storage)
- email services
- other integrations

These abstractions are defined as interfaces inside:

```
src/application/ports
```

## Infrastructure

Provides **concrete implementations** of the interfaces defined in the application layer.

This layer also includes **presentation mechanisms** that expose the application's functionality to external clients.

Currently, the system exposes its functionality through a **REST API built with Express**.

## License

MIT License
