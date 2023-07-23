import fs from "node:fs";
import path from "node:path";

import { Logger } from "@src/interfaces";
import { PINO_TOKEN } from "@src/utils/tokens";

import { injectable, inject } from "inversify";

import pg from "pg";

@injectable()
export class Postgres {
    
    private readonly client: pg.Client;

    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger
    ) {
        const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env;
        const conf = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB}`;
        this.client = new pg.Client({ connectionString: conf });
    }

    public async connect(): Promise<pg.Client> {
        try {
            await this.client.connect();
            this.logger.info("Connected to the database");
        } catch (error) {
            this.logger.error(`Error connecting to PostgreSQL:`);
            this.logger.error(String(error));
            process.exit(1);
        } finally {
            return this.client;
        }
    }

    public async createTables() {

        const tablesFolder = "src/utils/sql/tables";
        
        try {
            const files = fs.readdirSync(tablesFolder);
            for (const file of files) {
              const filePath = path.join(tablesFolder, file);
              const sqlQuery = fs.readFileSync(filePath, 'utf8');
              await this.client.query(sqlQuery);
              this.logger.info(`Successfully executed SQL query from ${file}:`);
            }
        
            this.logger.info('All tables created successfully.');
        } catch (error) {
            this.logger.error('Error creating tables:');
            this.logger.error(String(error));
        }
    }
}