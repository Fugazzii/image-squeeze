import fs from "fs";
import path from "path";
import pg from "pg";
import { injectable, inject } from "inversify";
import { Database, Logger } from "@src/interfaces";
import { PINO_TOKEN } from "@src/utils/tokens";

enum DB_OBJECT {
  TABLE = "TABLE",
  PROCEDURE = "PROCEDURE",
  VIEW = "VIEW",
}

@injectable()
export class Postgres implements Database {
  private readonly client: pg.Client;

  public constructor(@inject(PINO_TOKEN) private readonly logger: Logger) {
    const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env;
    const connectionString = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB}`;
    this.client = new pg.Client({ connectionString });
  }

  public async connect(): Promise<pg.Client> {
    try {
      await this.client.connect();
      this.logger.info("Connected to the database");
    } catch (error) {
      this.logger.error("Error connecting to PostgreSQL:");
      this.logger.error(String(error));
      process.exit(1);
    } finally {
      return this.client;
    }
  }

  public async build() {
    try {
      await this.createTables();
      await this.createProcedures();
      await this.createViews();
    } catch (error) {
      this.logger.error(error);
      await this.dropIfExists("users_count", DB_OBJECT.VIEW);  
      await this.dropIfExists("all_users_id", DB_OBJECT.VIEW);  
      await this.dropIfExists("all_users", DB_OBJECT.VIEW);  
      await this.dropIfExists("products_count", DB_OBJECT.VIEW);  
      await this.dropIfExists("all_products_id", DB_OBJECT.VIEW);  
      await this.dropIfExists("product_images", DB_OBJECT.VIEW);  
      await this.dropIfExists("all_products", DB_OBJECT.VIEW);
      
      await this.dropIfExists("products", DB_OBJECT.TABLE);
      await this.dropIfExists("users", DB_OBJECT.TABLE);
    }


}

  private async createProcedures() {
    await this.readFileAndRunQuery("src/utils/sql/procedures");
  }

  private async createTables() {
    await this.readFileAndRunQuery("src/utils/sql/tables");
  }

  private async createViews() {
    await this.readFileAndRunQuery("src/utils/sql/views");
  }

  private async dropIfExists(name: string, target: DB_OBJECT) {
    const query = `DROP ${target} IF EXISTS ${name}`;
    try {
      await this.client.query(query);
      this.logger.info(`Dropped ${target} ${name}`);
    } catch (error) {
      this.logger.error("Failed to drop table");
      throw error;
    }
  }

  private async readFileAndRunQuery(folderPath: string, log?: string) {
    try {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const sqlQuery = fs.readFileSync(filePath, "utf8");
        await this.client.query(sqlQuery);
        this.logger.info(`Successfully executed SQL query from ${file}:`);
      }
      log ? this.logger.info(log) : null;
    } catch (error) {
      throw error;
    }
  }
}
