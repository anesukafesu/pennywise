import { Actor } from "@entities/Actor";
import { Credential } from "@entities/Credential";
import { User } from "@entities/User";
import { CredentialRepository } from "@application/ports/repositories/CredentialRepository";
import { UserRepository } from "@application/ports/repositories/UserRepository";
import { IDGenerator } from "@application/ports/services/IDGenerator";
import { PasswordHasher } from "@application/ports/services/PasswordHasher";
import { TransactionRunner } from "@application/ports/services/TransactionRunner";
import { PasswordPolicy } from "@application/ports/services/PasswordPolicy";

export interface SignUpWithEmailAndPasswordDependencies {
  credentialRepository: CredentialRepository;
  userRepository: UserRepository;
  transactionRunner: TransactionRunner;
  passwordHasher: PasswordHasher;
  passwordPolicy: PasswordPolicy;
  idGenerator: IDGenerator;
}

interface SignUpWithEmailAndPasswordInput {
  details: {
    name: string;
    email: string;
    password: string;
  };
}

export class SignUpWithEmailAndPasswordUseCase {
  constructor(
    private readonly dependencies: SignUpWithEmailAndPasswordDependencies,
  ) {}

  async execute({
    details: { name, email, password },
  }: SignUpWithEmailAndPasswordInput): Promise<Actor> {
    const {
      credentialRepository,
      userRepository,
      transactionRunner,
      passwordHasher,
      passwordPolicy,
      idGenerator,
    } = this.dependencies;

    const existingUserWithEmail = await userRepository.getOneByEmail(email);

    if (existingUserWithEmail) {
      throw new InvalidInput("Email already in use.");
    }

    const user = new User(idGenerator.generate(), name, email, "");

    passwordPolicy.validate(password);
    const passwordHash = await passwordHasher.hash(password);

    const credential = new Credential(
      idGenerator.generate(),
      user.id,
      "email_password",
      email,
      passwordHash,
    );

    await transactionRunner.run(async (tx) => {
      await userRepository.createOne(user, tx);
      await credentialRepository.createOne(credential, tx);
    });

    return new Actor("user", user.id);
  }
}
