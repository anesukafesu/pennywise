import { Resource } from "@domain/types/ResourceTypes";

export class Expired extends Error {
    constructor(item: Resource, itemId: string) {
        super(`The ${item} (${itemId}) expired.`);
    }
}