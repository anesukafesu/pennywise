import { UUID } from "node:crypto";

export interface IDGenerator {
    generate(): UUID;
}