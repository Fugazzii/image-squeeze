import { Logger, PostgresRepository } from "@src/interfaces/";
import { PG_CONNECTION, PINO_TOKEN } from "@src/utils/tokens";
import { injectable, inject } from "inversify";
import pg from "pg";

@injectable()
export class UsersRepository implements PostgresRepository {

    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger,
        @inject(PG_CONNECTION) private readonly client: pg.Client
    ) {}

    public async insert(username: string, email: string, password: string): Promise<any> {
        this.logger.warn("Password need to be hashed");
        try {
            const query = `CALL register_new_user(${username}, ${email}, ${password}, 0);`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error("Error inserting data into the database.");
        }
    }

    public async delete(id: number): Promise<any> {
        try {
            const query = `CALL delete_user(${id});`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error("Error inserting data into the database.");
        }
    }

    public async update(id: number, data: any): Promise<any> {
        try {
            const updateValues = Object.entries(data)
                .map(([key, value]) => `${key} = '${value}'`)
                .join(", ");
            const query = `UPDATE users SET ${updateValues} WHERE id = ${id} RETURNING *`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error("Error updating data in the database.");
        }
    }

    public ping(): string {
        return "Pong! The server is alive.\n";
    }
}