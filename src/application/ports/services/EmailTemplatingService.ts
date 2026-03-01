type EmailTemplates =
  | "Onboarding"
  | "Verification"
  | "PasswordResetRequest"
  | "PasswordResetConfirmation"
  | "Invite";

export interface EmailTemplatingService {
  generate(template: EmailTemplates, params: Record<string, string>): string;
}
