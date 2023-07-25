import "reflect-metadata";
import pg from "pg";
import { config as configDotenv } from "dotenv";
import { Container, inject } from "inversify";

import { Controller, Database, Logger, Server } from "./interfaces";
import { UserController }from "./controllers";
import { UserService } from "./services";

import { bootstrap } from "./utils/container/bootstrap";

import { 
    AUTH_MIDDLEWARE,
    EXPRESS_SERVER_TOKEN, 
    PG_CONNECTION, 
    PINO_TOKEN, 
    POSTGRES_TOKEN, 
    USERS_SERVICE_TOKEN 
} from "./utils/tokens";
import { AuthMiddleware } from "./middlewares";

configDotenv();

/* App root, Nini magaria */

class App {

    private readonly controllers: Array<Controller>;
    private conn: pg.Client | null;

    public constructor(
        @inject(Container) private readonly container: Container,
        @inject(POSTGRES_TOKEN) private readonly database: Database,
        @inject(PINO_TOKEN) private readonly logger: Logger,
        @inject(EXPRESS_SERVER_TOKEN) private readonly server: Server
    ) {
        this.logger.info("Initializing app...");
        this.controllers = new Array<Controller>();
        this.conn = null;
    }

    public async init() {
        this.logger.info("App has started");

        this.conn = await this.database.connect();

        this.container.bind<pg.Client>(PG_CONNECTION).toConstantValue(this.conn);

        // await this.database.createTables();

        this.initializeControllers();

        this.server.listen(3000, () => this.logger.info("Server is listening!"));
    }

    public initializeControllers() {
        this.logger.info("Initializing controllers");
        const userService = this.container.get<UserService>(USERS_SERVICE_TOKEN);
        const authMiddleware = this.container.get<AuthMiddleware>(AUTH_MIDDLEWARE);

        const userController = new UserController(
            this.logger,
            userService,
            authMiddleware
        );

        this.controllers.push(userController);

        this.registerControllers();
    }

    public registerControllers() {
        for(let controller of this.controllers) {
            controller.registerRoutes(this.server);
        }        
    }

}


/* Entry function */

async function main() {
    const container: Container = await bootstrap();

    const logger = container.get<Logger>(PINO_TOKEN);
    const database = container.get<Database>(POSTGRES_TOKEN);
    const server = container.get<Server>(EXPRESS_SERVER_TOKEN);

    const app = new App(container, database, logger, server);
    app.init();
}

main();