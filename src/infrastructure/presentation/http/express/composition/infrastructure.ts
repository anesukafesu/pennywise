import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";
import { AppwriteBudgetLineItemRepository } from "@appwrite/repositories/BudgetLineItemRepository";
import { AppwriteBudgetRepository } from "@appwrite/repositories/BudgetRepository";
import { AppwriteCategoryRepository } from "@appwrite/repositories/CategoryRepository";
import { AppwriteCollaborationRepository } from "@appwrite/repositories/CollaborationRepository";
import { AppwriteCredentialRepository } from "@appwrite/repositories/CredentialRepository";
import { AppwriteInviteRepository } from "@appwrite/repositories/InviteRepository";
import { AppwriteTransactionRepository } from "@appwrite/repositories/TransactionRepository";
import { AppwriteUserRepository } from "@appwrite/repositories/UserRepository";
import { AppwriteWorkspaceRepository } from "@appwrite/repositories/WorkspaceRepository";
import { RedisOtpRepository } from "@infrastructure/persistence/redis/OtpRepository";
import { DefaultOTPGenerator } from "@infrastructure/services/default-otp-generator";
import { MockBackgroundEmailSendingService } from "@infrastructure/services/mock-background-email-sending-service";
import { RandomUUIDGenerator } from "@services/id-generator/IDGenerator";
import { BcryptPasswordHasher } from "@services/password-hasher/PasswordHasher";
import { DefaultPasswordPolicy } from "@services/password-policy/PasswordPolicy";
import { AppwriteTransactionRunner } from "@services/transaction-runner/AppwriteTransactionRunner";
import { createClient } from "redis";

export async function createInfrastructure() {
  const db = new AppwriteDatabaseService(
    process.env.APPWRITE_ENDPOINT!,
    process.env.APPWRITE_PROJECT!,
    process.env.APPWRITE_API_KEY!,
    process.env.DATABASE_ID!,
  );

  const redisOtpClient = createClient({
    url: process.env.REDIS_OTP_REPOSITORY_URL!,
  });

  return {
    repositories: {
      budget: new AppwriteBudgetRepository(db),
      budgetLineItem: new AppwriteBudgetLineItemRepository(db),
      category: new AppwriteCategoryRepository(db),
      collaboration: new AppwriteCollaborationRepository(db),
      credential: new AppwriteCredentialRepository(db),
      invite: new AppwriteInviteRepository(db),
      transaction: new AppwriteTransactionRepository(db),
      user: new AppwriteUserRepository(db),
      workspace: new AppwriteWorkspaceRepository(db),
    },

    services: {
      passwordHasher: new BcryptPasswordHasher(),
      passwordPolicy: new DefaultPasswordPolicy(),
      idGenerator: new RandomUUIDGenerator(),
      transactionRunner: new AppwriteTransactionRunner(db),
      otpGenerator: new DefaultOTPGenerator(),
      backgroundEmailSendingService: new MockBackgroundEmailSendingService(),
      otpRepository: new RedisOtpRepository(redisOtpClient),
    },
  };
}
