import { PasswordResetOtpRepository } from "@application/ports/repositories/PasswordResetOtpRepository";
import { EmailSendingService } from "@application/ports/services/EmailSendingService";
import { PasswordResetTokenGenerator } from "@application/ports/services/PasswordResetTokenGenerator";

interface RequestPasswordResetDependencies {
  passwordResetOtpRepository: PasswordResetOtpRepository;
  passwordResetTokenGenerator: PasswordResetTokenGenerator;
  emailService: EmailSendingService;
}

interface RequestPasswordResetInput {
  data: {
    email: string;
  };
}

export class RequestPasswordResetUseCase {
  constructor(
    private readonly dependencies: RequestPasswordResetDependencies,
  ) {}

  async execute(input: RequestPasswordResetInput): Promise<void> {
    const {
      passwordResetOtpRepository,
      passwordResetTokenGenerator,
      emailService,
    } = this.dependencies;

    const resetToken = await passwordResetTokenGenerator.generateToken();

    await passwordResetOtpRepository.storeOtp(input.data.email, resetToken);

    await emailService.send({
      to: input.data.email,
      subject: "Password Reset Request",
      textBody: this.generateEmailBody(resetToken),
    });
  }

  private generateEmailBody(token: string): string {
    return `Use the following token to reset your password: ${token}`;
  }
}
