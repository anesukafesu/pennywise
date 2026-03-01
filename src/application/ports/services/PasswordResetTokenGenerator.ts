export interface PasswordResetTokenGenerator {
  generateToken(): Promise<string>;
}
