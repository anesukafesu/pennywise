import { Resource } from "@domain/types/ResourceTypes";

export class NotFound extends Error {
    constructor(resourceType: Resource, resourceId?: string) {
        super(`The ${resourceType} ${ resourceId ? `(${resourceId})` : "" } does not exist.`);
    }
}