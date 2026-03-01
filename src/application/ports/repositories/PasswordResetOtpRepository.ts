export interface PasswordResetOtpRepository {
  storeOtp(identifier: string, otp: string): Promise<void>;
  retrieveOtp(identifier: string): Promise<string | null>;
}
