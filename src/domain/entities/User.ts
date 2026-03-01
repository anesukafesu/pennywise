import { InvalidInput } from "@domain/errors/InvalidInput";
import { isValidEmail } from "@utils/isValidEmail";
import { UUID } from "node:crypto";

export class User {
  constructor(
    public id: UUID,
    public name: string,
    public email: string,
    public avatarUrl: string,
  ) {
    if (name.trim() === "") {
      throw new InvalidInput("A name is required.");
    }

    if (!isValidEmail(email)) {
      throw new InvalidInput("The provided email is invalid.");
    }
  }
}
