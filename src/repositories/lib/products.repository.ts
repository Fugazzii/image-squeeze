import { Logger, PostgresRepository, ProductInterface } from "@src/interfaces/";
import { PG_CONNECTION, PINO_TOKEN } from "@src/utils/tokens";
import { injectable, inject } from "inversify";
import pg from "pg";

@injectable()
export class ProductsRepository implements PostgresRepository {
  public constructor(
    @inject(PINO_TOKEN) private readonly logger: Logger,
    @inject(PG_CONNECTION) private readonly client: pg.Client
  ) {}
    

    /* Procedures */

    public async insert(product: ProductInterface): Promise<any> {
        try {
            const { title, img, price, quantity, author_id } = product;
            const query = `CALL add_product('${title}', '${img}', ${price}, ${quantity}, ${author_id});`;
            await this.client.query(query);
            return product;
        } catch (error) {
            this.logger.error("Error while inserting product");
            throw error;
        }
    }

    public async deleteOne(id: number): Promise<any> {
        try {
            const query = `CALL delete_product('${id}');`;
            const values = [id];
            await this.client.query(query, values);
            return { id };
        } catch (error) {
            this.logger.error("Error while deleting product");
            throw error;
        }
    }

    public async findAll(): Promise<any> {
        try {
            const query = `SELECT * FROM all_products`;
            const result = await this.client.query(query);
            return result.rows;
        } catch (error) {
            this.logger.error("Error while getting all products");
            throw error;
        }
    }

    public async findOne(id: number): Promise<any> {
        try {
            const query = `SELECT * FROM products WHERE id = ${id}`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            this.logger.error("Error while retrieving product");
            throw error;
        }
    }

    public ping(): string {
        throw new Error("Method not implemented.");
    }

}
