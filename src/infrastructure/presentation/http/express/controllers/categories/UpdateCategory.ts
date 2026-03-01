import { UpdateCategoryUseCase } from "@use-cases/categories/UpdateCategory";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class UpdateCategoryController {
  constructor(private readonly useCase: UpdateCategoryUseCase) {}

  async handle(request: Request, response: Response) {
    const updatedCategory = await this.useCase.execute({
      actor: request.actor,
      details: {
        categoryId: request.params.categoryId as UUID,
        name: request.body.name,
        classification: request.body.classification,
        subclassification: request.body.subclassification,
      },
    });

    response.status(200).json(updatedCategory);
  }
}
