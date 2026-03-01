import { TransactionDTO } from "@application/dtos/TransactionDTO";
import { NotFound } from "@application/errors/NotFound";
import { Transaction } from "@entities/Transaction";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";

export async function mapTransactionsToDTOs(
    transactions: Transaction[],
    categoryRepository: CategoryRepository
): Promise<TransactionDTO[]> {

    const categoryIds = [...new Set(transactions.map(t => t.categoryId))];
    const transactionCategories = await categoryRepository.getManyByIds(categoryIds);
    const categoriesMap = new Map(transactionCategories.map(c => [c.id, c.name]));

    return transactions.map(transaction => {
        const categoryName = categoriesMap.get(transaction.categoryId);

        if (!categoryName) {
            throw new NotFound("category", transaction.categoryId);
        }

        return {
            id: transaction.id,
            workspaceId: transaction.workspaceId,
            date: transaction.date,
            categoryId: transaction.categoryId,
            categoryName: categoryName,
            amount: transaction.amount,
            notes: transaction.notes,
            documentationUrl: transaction.documentationUrl,
        };
    })
}