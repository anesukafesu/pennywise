import { UserDTO } from "@application/dtos/UserDTO";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { InvalidInput } from "@domain/errors/InvalidInput";
import { Actor } from "@entities/Actor";
import { User } from "@entities/User";
import { UserRepository } from "@application/ports/repositories/UserRepository";

interface UpdateUserDetailsDependencies {
  userRepository: UserRepository;
}

interface UpdateUserDetailsInput {
  actor: Actor;
  details: {
    name?: string;
    avatarUrl?: string;
  };
}

export class UpdateUserDetailsUseCase {
  constructor(private readonly dependencies: UpdateUserDetailsDependencies) {}

  async execute({ actor, details }: UpdateUserDetailsInput): Promise<UserDTO> {
    ensureActorIsAuthenticated(actor);

    const { userRepository } = this.dependencies;

    if (Object.keys(details).length === 0) {
      throw new InvalidInput("Expected at least one detail to update.");
    }

    const user = await ensureResourceExists("user", actor.id, userRepository);

    const updatedUser = new User(
      actor.id,
      details.name ?? user.name,
      user.email,
      details.avatarUrl ?? user.avatarUrl,
    );

    await userRepository.updateOne(updatedUser);

    return { ...updatedUser };
  }
}
