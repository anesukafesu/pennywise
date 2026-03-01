import { CreateCategoryUseCase } from "@use-cases/categories/CreateCategory";
import { Request, Response } from "express";

export class CreateCategoryController {
  constructor(private readonly useCase: CreateCategoryUseCase) {}

  async handle(request: Request, response: Response) {
    const category = await this.useCase.execute({
      actor: request.actor,
      details: {
        name: request.body.name,
        workspaceId: request.body.workspaceId,
        classification: request.body.classification,
        subclassification: request.body.subclassification,
      },
    });

    response.status(201).json(category);
  }
}
