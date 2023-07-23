import { PostgresRepository } from "@src/interfaces";
import { PRODUCTS_REPOSITORY } from "@src/utils/tokens";
import { inject, injectable } from "inversify";

@injectable()
export class ProductsService {
    public constructor(
        @inject(PRODUCTS_REPOSITORY) private readonly productsRepository: PostgresRepository
    ) {}

    public add() {
        /* Logic */
    }

    public delete() {
        /* Logic */
    }

    public edit() {

    }
}