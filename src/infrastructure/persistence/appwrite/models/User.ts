import { User as UserEntity } from "@entities/User";
import { Models } from "node-appwrite";

export interface UserRowData extends Omit<UserEntity, "id"> {}

export interface AppwriteUserRow extends Models.Row, UserRowData {}