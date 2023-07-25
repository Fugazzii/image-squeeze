import { PostgresRepository, Logger } from "@src/interfaces/";
import { injectable, inject } from "inversify";
import pg from "pg";

import { PINO_TOKEN, PG_CONNECTION } from "@src/utils/tokens";

@injectable()
export class ProductsRepository implements PostgresRepository {

    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger,
        @inject(PG_CONNECTION) private readonly client: pg.Client,
    ) {}

    public async insert(data: any): Promise<any> {
        try {
            const query = ``;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error("Error inserting data into the database.");
        }
    }

    public async deleteOne(id: number): Promise<any>;
    public async deleteOne(email: string): Promise<any>;    
    public async deleteOne(arg: number | string): Promise<any> {
        try {
            const query = ``;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            this.logger.error(error);
            throw new Error("Error deleting data from the database.");
        }
    }

    public async findAll(): Promise<any[]> {
        try {
            const query = `SELECT * FROM all_products`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error()
        }
    }

    public findOne(id: number): Promise<any>;
    public findOne(email: string): Promise<any>;
    public findOne(email: unknown): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public ping() {
        return "pong";
    }
}