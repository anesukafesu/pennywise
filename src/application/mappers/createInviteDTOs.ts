import type { Invite } from "@domain/entities/Invite";
import type { User } from "@domain/entities/User";
import type { InviteDTO } from "@application/dtos/InviteDTO";

export function createInviteDTOs(
  invites: Invite[],
  users: User[],
): InviteDTO[] {
  const usersMap = new Map(users.map((user) => [user.id, user]));

  return invites.map((invite) => {
    const user = usersMap.get(invite.userId);

    if (!user) {
      throw new Error(
        `User with id ${invite.userId} not found for invite with id ${invite.id}`,
      );
    }

    return {
      id: invite.id,
      workspaceId: invite.workspaceId,
      expiresOn: invite.expiresOn,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    };
  });
}
