import { AppwriteUserRow, UserRowData } from "@appwrite-models/User";
import { toUUID } from "@domain/value-objects/toUUID";
import { User as UserEntity } from "@entities/User";

export class UserMapper {
    static toPersistence(user: UserEntity): UserRowData {
        return {
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
        }
    }

    static fromPersistence(user: AppwriteUserRow): UserEntity {
        return new UserEntity(
            toUUID(user.$id),
            user.name,
            user.email,
            user.avatarUrl,
        )
    }
}