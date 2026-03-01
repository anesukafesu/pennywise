import { storeActorInSession } from "@infrastructure/presentation/http/express/session/actorSession";
import { SignInWithEmailAndPasswordUseCase } from "@use-cases/auth/SignInWithEmailAndPassword";
import { Request, Response } from "express";

export class SignInWithEmailAndPasswordController {
  constructor(private readonly useCase: SignInWithEmailAndPasswordUseCase) {}

  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const actor = await this.useCase.execute({ details: { email, password } });

    storeActorInSession(req, actor);

    res.status(204).end();
  }
}
