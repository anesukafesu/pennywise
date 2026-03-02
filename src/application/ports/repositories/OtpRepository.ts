export type OtpPurpose =
  | "password_reset"
  | "signup_email_verification"
  | "login_verification"
  | "delete_account_verification";

export interface OtpRepository {
  storeOtp(purpose: OtpPurpose, identifier: string, otp: string): Promise<void>;
  retrieveOtp(purpose: OtpPurpose, identifier: string): Promise<string | null>;
}
