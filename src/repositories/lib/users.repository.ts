import { Logger, PostgresRepository } from "@src/interfaces/";
import { PG_CONNECTION, PINO_TOKEN } from "@src/utils/tokens";
import { injectable, inject } from "inversify";
import pg from "pg";

@injectable()
export class UsersRepository implements PostgresRepository {

    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger,
        @inject(PG_CONNECTION) private readonly client: pg.Client,
    ) {}
    

    /* Procedures */

    public async insert(username: string, email: string, password: string): Promise<any> {
        this.logger.warn("Password need to be hashed");
        try {
            const query = `CALL register_new_user('${username}', '${email}', '${password}', 0);`;
            await this.client.query(query);
            return email;
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: number): Promise<any> {
        try {
            const query = `CALL delete_user(${id});`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            this.logger.error("Error while deleting data");
            throw error;
        }
    }

    public async deleteUserByEmail(email: string) {
        try {
            const query = `CALL delete_user_from_email(${email});`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            this.logger.error("Error while deleting data by email");
            throw error;
        }
    }

    public async update(...args: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    /* Views */

    public async findAllIds() {
        try {
            const query = `SELECT * FROM all_users_id`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            this.logger.error("Error while getting all users using id");
            throw error;
        }
    }

    public async findAll() {
        try {
            const query = `SELECT * FROM all_users`;
            const result = await this.client.query(query);
            console.log(result);
            return result.rows[0];
        } catch (error) {
            this.logger.error("Error while getting all users");
            throw error;
        }
    }

    public async findOne(id: number): Promise<any>;
    public async findOne(email: string): Promise<any>;
    public async findOne(arg: number | string): Promise<any> {
        
        const key = typeof arg === "number" ? "id" : "email";
        
        try {
            const query = `SELECT * FROM users WHERE ${key} = '${arg}'`;
            const result = await this.client.query(query);
            return result.rows[0];
        } catch (error) {
            this.logger.error("Error while retrieving user using id");
            throw error;
        }
        
    }

    public ping(): string {
        return "Pong! The server is alive.\n";
    }
}