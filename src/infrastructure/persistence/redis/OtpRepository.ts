import type {
  OtpPurpose,
  OtpRepository,
} from "@application/ports/repositories/OtpRepository";
import type { createClient } from "redis";

export class RedisOtpRepository implements OtpRepository {
  constructor(private readonly client: ReturnType<typeof createClient>) {}

  async storeOtp(
    purpose: OtpPurpose,
    identifier: string,
    otp: string,
  ): Promise<void> {
    this.client.set(`${purpose}:${identifier}`, otp, {
      EX: 600, // OTP expires in 10 minutes
    });
  }

  async retrieveOtp(
    purpose: OtpPurpose,
    identifier: string,
  ): Promise<string | null> {
    return await this.client.get(`${purpose}:${identifier}`);
  }
}
