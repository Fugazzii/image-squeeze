import "reflect-metadata";
import pg from "pg";
import { config as configDotenv } from "dotenv";
import { Container, inject } from "inversify";

import { CacheMemory, Controller, Database, Logger, Server } from "./interfaces";
import { ProductsController, UserController }from "./controllers";
import { ProductsService, UserService } from "./services";

import { bootstrap } from "./utils/container/bootstrap";

import { 
    AUTH_MIDDLEWARE,
    ERROR_HANDLER,
    EXPRESS_SERVER_TOKEN, 
    FILEHANDLER_MIDDLEWARE, 
    PG_CONNECTION, 
    PINO_TOKEN, 
    POSTGRES_TOKEN, 
    PRODUCTS_SERVICE_TOKEN, 
    REDIS_TOKEN, 
    RESPONSE_HANDLER, 
    USERS_SERVICE_TOKEN 
} from "./utils/tokens";
import { AuthMiddleware, Filehandler } from "./middlewares";

import AWS from "aws-sdk";
import { ErrorHandler, ResponseHandler } from "./utils/handlers";

configDotenv();

class App {

    private readonly controllers: Array<Controller>;
    private conn: pg.Client | null;

    public constructor(
        @inject(Container) private readonly container: Container,
        @inject(POSTGRES_TOKEN) private readonly database: Database,
        @inject(REDIS_TOKEN) private readonly cache: CacheMemory,
        @inject(PINO_TOKEN) private readonly logger: Logger,
        @inject(EXPRESS_SERVER_TOKEN) private readonly server: Server
    ) {
        this.logger.info("Initializing app...");
        this.controllers = new Array<Controller>();
        this.conn = null;
    }

    public async init() {
        this.logger.info("App has started");

        this.conn = await this.database.connect() as pg.Client;

        await this.cache.connect();

        this.container.bind<pg.Client>(PG_CONNECTION).toConstantValue(this.conn);

        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });

        // Reconfigure database (?)
        // await this.database.build();            

        this.initializeControllers();
        this.server.listen(3000, () => this.logger.info("Server is listening!"));
    }

    public initializeControllers() {
        this.logger.info("Initializing controllers");
        const userService = this.container.get<UserService>(USERS_SERVICE_TOKEN);
        const authMiddleware = this.container.get<AuthMiddleware>(AUTH_MIDDLEWARE);
        const filehandlerMiddleware = this.container.get<Filehandler>(FILEHANDLER_MIDDLEWARE);
        const errorHandler = this.container.get<ErrorHandler>(ERROR_HANDLER);
        const responseHandler = this.container.get<ResponseHandler>(RESPONSE_HANDLER);

        const userController = new UserController(
            this.logger,
            userService,
            authMiddleware,
            errorHandler,
            responseHandler
        );

        const productsService = this.container.get<ProductsService>(PRODUCTS_SERVICE_TOKEN);

        const productController = new ProductsController(
            this.logger,
            productsService,
            authMiddleware,
            filehandlerMiddleware,
            errorHandler,
            responseHandler
        );

        this.controllers.push(userController);
        this.controllers.push(productController);

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
    const cache = container.get<CacheMemory>(REDIS_TOKEN);
    const server = container.get<Server>(EXPRESS_SERVER_TOKEN);

    const app = new App(container, database, cache, logger, server);
    app.init();
}

main();
