export class Unauthenticated extends Error {
    constructor() {
        super("Unauthenticated.");
    }
}