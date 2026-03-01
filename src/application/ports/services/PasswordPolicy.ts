export interface PasswordPolicy {
  validate: (value: string) => void;
}
