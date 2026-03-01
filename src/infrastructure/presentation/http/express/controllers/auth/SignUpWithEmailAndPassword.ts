import { storeActorInSession } from "@infrastructure/presentation/http/express/session/actorSession";
import { SignUpWithEmailAndPasswordUseCase } from "@use-cases/auth/SignUpWithEmailAndPassword";
import { Request, Response } from "express";

export class SignUpWithEmailAndPasswordController {
  constructor(private readonly useCase: SignUpWithEmailAndPasswordUseCase) {}

  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const actor = await this.useCase.execute({
      details: { name, email, password },
    });

    storeActorInSession(req, actor);

    res.status(200).json({
      id: actor.id,
      name: name,
      email: email,
    });
  }
}
