import { RedisOtpRepository } from "@infrastructure/persistence/redis/OtpRepository";
import { PostgresDatabaseService } from "@infrastructure/persistence/postgres/client/PostgresDatabaseService";
import { PostgresBudgetLineItemRepository } from "@infrastructure/persistence/postgres/repositories/BudgetLineItemRepository";
import { PostgresBudgetRepository } from "@infrastructure/persistence/postgres/repositories/BudgetRepository";
import { PostgresCategoryRepository } from "@infrastructure/persistence/postgres/repositories/CategoryRepository";
import { PostgresCollaborationRepository } from "@infrastructure/persistence/postgres/repositories/CollaborationRepository";
import { PostgresCredentialRepository } from "@infrastructure/persistence/postgres/repositories/CredentialRepository";
import { PostgresInviteRepository } from "@infrastructure/persistence/postgres/repositories/InviteRepository";
import { PostgresTransactionRepository } from "@infrastructure/persistence/postgres/repositories/TransactionRepository";
import { PostgresUserRepository } from "@infrastructure/persistence/postgres/repositories/UserRepository";
import { PostgresWorkspaceRepository } from "@infrastructure/persistence/postgres/repositories/WorkspaceRepository";
import { PostgresTransactionRunner } from "@infrastructure/persistence/postgres/services/PostgresTransactionRunner";
import { DefaultOTPGenerator } from "@infrastructure/services/default-otp-generator";
import { MockBackgroundEmailSendingService } from "@infrastructure/services/mock-background-email-sending-service";
import { RandomUUIDGenerator } from "@services/id-generator/IDGenerator";
import { BcryptPasswordHasher } from "@services/password-hasher/PasswordHasher";
import { DefaultPasswordPolicy } from "@services/password-policy/PasswordPolicy";
import { Pool } from "pg";
import { createClient } from "redis";

export async function createInfrastructure() {
  const postgresPool = new Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING!,
  });

  const db = new PostgresDatabaseService(postgresPool);

  const redisOtpClient = createClient({
    url: process.env.REDIS_URL!,
  });

  return {
    repositories: {
      budget: new PostgresBudgetRepository(db),
      budgetLineItem: new PostgresBudgetLineItemRepository(db),
      category: new PostgresCategoryRepository(db),
      collaboration: new PostgresCollaborationRepository(db),
      credential: new PostgresCredentialRepository(db),
      invite: new PostgresInviteRepository(db),
      transaction: new PostgresTransactionRepository(db),
      user: new PostgresUserRepository(db),
      workspace: new PostgresWorkspaceRepository(db),
    },

    services: {
      passwordHasher: new BcryptPasswordHasher(),
      passwordPolicy: new DefaultPasswordPolicy(),
      idGenerator: new RandomUUIDGenerator(),
      transactionRunner: new PostgresTransactionRunner(db),
      otpGenerator: new DefaultOTPGenerator(),
      backgroundEmailSendingService: new MockBackgroundEmailSendingService(),
      otpRepository: new RedisOtpRepository(redisOtpClient),
    },
  };
}
