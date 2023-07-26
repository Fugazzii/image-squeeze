import { PostgresRepository, ProductInterface } from "@src/interfaces";
import { PRODUCTS_REPOSITORY } from "@src/utils/tokens";
import { inject, injectable } from "inversify";

@injectable()
export class ProductsService {
    public constructor(
        @inject(PRODUCTS_REPOSITORY) private readonly productsRepository: PostgresRepository
    ) {}

    public findAll() {
        return this.productsRepository.findAll();
    }

    public findOne(id: number) {
        return this.productsRepository.findOne(id);
    }

    public deleteOne(id: number) {
        return this.productsRepository.deleteOne(id);
    }

    public insert(product: ProductInterface) {
        return this.productsRepository.insert(product);
    }

}