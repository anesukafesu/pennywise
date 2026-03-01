import { UserDTO } from "@application/dtos/UserDTO";
import { NotFound } from "@application/errors/NotFound";
import { Actor } from "@entities/Actor";
import { UserRepository } from "@application/ports/repositories/UserRepository";

export interface GetUserDetailsDependencies {
  userRepository: UserRepository;
}

interface GetUserDetailsInput {
  actor: Actor;
}

export class GetUserDetailsUseCase {
  constructor(private readonly dependencies: GetUserDetailsDependencies) {}

  async execute({ actor }: GetUserDetailsInput): Promise<UserDTO> {
    const { userRepository } = this.dependencies;
    const user = await userRepository.getOneById(actor.id);

    if (!user) {
      throw new NotFound("user", actor.id);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
  }
}
