import { Models } from "node-appwrite";
import { Credential as CredentialEntity } from "@entities/Credential";

/*
CredentialEntity: how the domain and business logic think about credentials.

CredentialRowData: the data we pass in to Appwrite when writing or updating a row of credentials.

AppwriteCredentialRow: what Appwrite returns when we read data from a row in the database. It
includes CredentialRowData and some fields that Appwrite automatically creates and maintains
for every row such as $id, $createdAt etc.
 */
export interface CredentialRowData extends Omit<CredentialEntity, "id" | "userId"> {
    userId: string;
}

export interface AppwriteCredentialRow extends Models.Row, CredentialRowData {}