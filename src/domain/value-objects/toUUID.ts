import { UUID } from "node:crypto";

export function toUUID(value: string): UUID {
    return value as UUID;
}