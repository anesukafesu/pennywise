import { Collaboration } from "@domain/entities/Collaboration";
import { CollaborationDTO } from "@application/dtos/CollaborationDTO";
import { User } from "@domain/entities/User";

export function createCollaborationDTOs(
  collaborations: Collaboration[],
  users: User[],
): CollaborationDTO[] {
  const userIdToUserEntityMap = new Map(users.map((user) => [user.id, user]));

  return collaborations.map((collaboration) => {
    const user = userIdToUserEntityMap.get(collaboration.userId);

    if (!user) {
      throw new Error(
        `User with id ${collaboration.userId} not found for collaboration with id ${collaboration.id}`,
      );
    }

    return {
      id: collaboration.id,
      dateCreated: collaboration.dateCreated.toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      role: collaboration.role,
    };
  });
}
