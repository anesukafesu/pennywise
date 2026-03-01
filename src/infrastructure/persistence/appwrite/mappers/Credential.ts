import { toUUID } from "@domain/value-objects/toUUID";
import { Credential as CredentialEntity } from "@entities/Credential";
import { CredentialRowData, AppwriteCredentialRow } from "@appwrite-models/Credential";

export class CredentialMapper {
    static toPersistence(credential: CredentialEntity): CredentialRowData {
        return {
            userId: credential.userId,
            type: credential.type,
            identifier: credential.identifier,
            secretHash: credential.secretHash,
        }
    }

    static fromPersistence(credentialRow: AppwriteCredentialRow): CredentialEntity {
        return new CredentialEntity(
            toUUID(credentialRow.$id),
            toUUID(credentialRow.userId),
            credentialRow.type,
            credentialRow.identifier,
            credentialRow.secretHash,
        )
    }
}