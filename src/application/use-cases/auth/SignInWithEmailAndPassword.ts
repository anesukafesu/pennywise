import { ResourceConflict } from "@application/errors/ResourceConflict";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { InvalidInput } from "@domain/errors/InvalidInput";
import { Actor } from "@entities/Actor";
import { CredentialRepository } from "@application/ports/repositories/CredentialRepository";
import { UserRepository } from "@application/ports/repositories/UserRepository";
import { PasswordHasher } from "@application/ports/services/PasswordHasher";

export interface AuthenticateUserWithEmailAndPasswordDependencies {
  credentialRepository: CredentialRepository;
  passwordHasher: PasswordHasher;
}

interface AuthenticateUserWithEmailAndPasswordInput {
  details: {
    email: string;
    password: string;
  };
}

export class SignInWithEmailAndPasswordUseCase {
  constructor(
    private readonly dependencies: AuthenticateUserWithEmailAndPasswordDependencies,
  ) {}

  async execute({
    details: { email, password },
  }: AuthenticateUserWithEmailAndPasswordInput): Promise<Actor> {
    const { credentialRepository, passwordHasher } = this.dependencies;

    const credential = await credentialRepository.findByIdentifier(email);

    if (!credential) {
      throw new InvalidInput("Email or password incorrect.");
    }

    const passwordIsCorrect = await passwordHasher.verify(
      password,
      credential.secretHash,
    );

    if (!passwordIsCorrect) {
      throw new InvalidInput("Email or password incorrect.");
    }

    return new Actor("user", credential.userId);
  }
}
