import { CacheMemory, Logger, PostgresRepository, ProductInterface } from "@src/interfaces/";
import { PG_CONNECTION, PINO_TOKEN, REDIS_TOKEN } from "@src/utils/tokens";
import { injectable, inject } from "inversify";
import pg from "pg";

@injectable()
export class ProductsRepository implements PostgresRepository {
  public constructor(
    @inject(PINO_TOKEN) private readonly logger: Logger,
    @inject(PG_CONNECTION) private readonly client: pg.Client,
    @inject(REDIS_TOKEN) private readonly cache: CacheMemory
  ) {}

    /* Procedures */

    public async insert(product: ProductInterface): Promise<any> {
        try {
            const { title, img_xl, img_l, img_m, img_s, price, quantity, author_id } = product;
            const query = `CALL add_product(
                '${title}',
                '${img_xl}', 
                '${img_l}', 
                '${img_m}', 
                '${img_s}',
                ${price}, 
                ${quantity},
                ${author_id});`;
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
        
        /* Retrieve value from cache */
        try {
            const cachedValue = await this.cache.get(String(id));
            console.log("cached", cachedValue);
            if(cachedValue) return cachedValue;
            
        } catch (error) {
            this.logger.error("Error while retreiving product from cache memory");
            throw error;
        }
        
        /* Retrieve value from RDBMS and cache it */
        try {
            const query = `SELECT * FROM products WHERE id = ${id}`;
            const db_response = await this.client.query(query);

            const result = db_response.rows[0]; 

            this.cache.add(String(id), result, Number(process.env.CACHED_DATA_EXPIRATION));
            console.log("added to cache, ", String(id), result);

            return result;
        } catch (error) {
            this.logger.error("Error while retrieving product from RDBMS");
            throw error;
        }

    }

    public ping(): string {
        throw new Error("Method not implemented.");
    }

}
