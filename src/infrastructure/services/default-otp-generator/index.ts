import { OtpGenerator } from "@application/ports/services/OtpGenerator";

export class DefaultOTPGenerator implements OtpGenerator {
  generate(): string {
    return Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0");
  }
}
