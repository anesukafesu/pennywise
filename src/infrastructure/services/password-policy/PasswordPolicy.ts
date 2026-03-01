import { PasswordPolicy } from "@application/ports/services/PasswordPolicy";

export class DefaultPasswordPolicy implements PasswordPolicy {
  validate(password: string) {
    // TODO: Implement the actual policy
    return true;
  }
}
