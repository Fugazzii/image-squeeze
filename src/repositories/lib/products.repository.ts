import { PostgresRepository } from "@src/interfaces/";
import { injectable } from "inversify";
import pg from "pg";

@injectable()
export class ProductsRepository implements PostgresRepository {

    public constructor(private readonly client: pg.Client) {}

    public async insert(data: any): Promise<any> {
        try {
            const query = `INSERT INTO products (${Object.keys(data).join(",")})
                           VALUES (${Object.values(data).map((value) => `'${value}'`).join(",")}) 
                           RETURNING *`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error("Error inserting data into the database.");
        }
    }

    public async delete(id: number): Promise<any> {
        try {
            const query = `DELETE FROM products WHERE id = ${id} RETURNING *`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error("Error deleting data from the database.");
        }
    }

    public async update(id: number, data: any): Promise<any> {
        try {
            const updateValues = Object.entries(data)
                .map(([key, value]) => `${key} = '${value}'`)
                .join(", ");
            const query = `UPDATE products SET ${updateValues} WHERE id = ${id} RETURNING *`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error("Error updating data in the database.");
        }
    }

    public ping() {
        return "pong";
    }
}