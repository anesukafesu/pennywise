import { OtpRepository } from "@application/ports/repositories/OtpRepository";
import { BackgroundEmailSendingService } from "@application/ports/services/EmailSendingService";
import { OtpGenerator } from "@application/ports/services/OtpGenerator";

interface RequestPasswordResetDependencies {
  passwordResetOtpRepository: OtpRepository;
  passwordResetTokenGenerator: OtpGenerator;
  emailService: BackgroundEmailSendingService;
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

    const resetToken = passwordResetTokenGenerator.generate();

    await passwordResetOtpRepository.storeOtp(
      "password_reset",
      input.data.email,
      resetToken,
    );

    await emailService.addToQueue({
      to: input.data.email,
      subject: "Password Reset Request",
      textBody: this.generateEmailBody(resetToken),
    });
  }

  private generateEmailBody(token: string): string {
    return `Use the following token to reset your password: ${token}`;
  }
}
