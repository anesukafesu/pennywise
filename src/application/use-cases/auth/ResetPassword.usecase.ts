import { EmailSendingService } from "@application/ports/services/EmailSendingService";
import { PasswordResetOtpRepository } from "@application/ports/repositories/PasswordResetOtpRepository";
import { PasswordPolicy } from "@application/ports/services/PasswordPolicy";
import { NotFound } from "@application/errors/NotFound";
import { CredentialRepository } from "@application/ports/repositories/CredentialRepository";
import { Credential } from "@domain/entities/Credential";
import { PasswordHasher } from "@application/ports/services/PasswordHasher";

interface ResetPasswordUseCaseDependencies {
  emailSendingService: EmailSendingService;
  passwordResetOtpRepository: PasswordResetOtpRepository;
  passwordPolicy: PasswordPolicy;
  passwordHasher: PasswordHasher;
  credentialRepository: CredentialRepository;
}

interface ResetPasswordUseCaseInput {
  data: {
    email: string;
    resetToken: string;
    newPassword: string;
  };
}

export class ResetPasswordUseCase {
  constructor(
    private readonly dependencies: ResetPasswordUseCaseDependencies,
  ) {}

  async execute({
    data: { email, resetToken: suppliedToken, newPassword },
  }: ResetPasswordUseCaseInput): Promise<void> {
    const {
      emailSendingService,
      passwordResetOtpRepository,
      passwordPolicy,
      passwordHasher,
      credentialRepository,
    } = this.dependencies;

    const correctToken = await passwordResetOtpRepository.retrieveOtp(email);

    if (correctToken === null) {
      throw new Error("Password reset token not found for the provided email.");
    }

    if (correctToken !== suppliedToken) {
      throw new Error("Password reset token is invalid.");
    }

    passwordPolicy.validate(newPassword);
    const hashedPassword = await passwordHasher.hash(newPassword);

    const credential = await credentialRepository.findByIdentifier(email);
    if (!credential) {
      throw new NotFound("credential", email);
    }

    const updatedCredential = new Credential(
      credential.id,
      credential.userId,
      credential.type,
      credential.identifier,
      hashedPassword,
    );

    await credentialRepository.update(updatedCredential);

    await emailSendingService.send({
      to: email,
      subject: "Your password has been reset",
      textBody: this.generateEmailBody(),
    });
  }

  private generateEmailBody(): string {
    return `Your password has been successfully reset. If you did not initiate this change, please contact our support team immediately.`;
  }
}
