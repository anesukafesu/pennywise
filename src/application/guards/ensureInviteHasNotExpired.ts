import { Expired } from "@application/errors/Expired";
import { Invite } from "@entities/Invite";

export function ensureInviteHasNotExpired(invite: Invite) {
    if (invite.expiresOn <= new Date()) {
        throw new Expired("invite", invite.id);
    }
}