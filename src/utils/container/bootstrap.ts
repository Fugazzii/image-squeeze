import { Container } from "inversify";

import { PinoLogger, ProductsService, UserService } from "@src/services/";
import { ExpressServer, Postgres } from "@src/config";
import { ProductsRepository, UsersRepository } from "@src/repositories/";
import { Server, Database, Logger, PostgresRepository } from "@src/interfaces";

import { 
  AUTH_MIDDLEWARE,
  EXPRESS_SERVER_TOKEN, 
  PINO_TOKEN, 
  POSTGRES_TOKEN, 
  PRODUCTS_REPOSITORY, 
  PRODUCTS_SERVICE_TOKEN, 
  USERS_REPOSITORY, 
  USERS_SERVICE_TOKEN
} from "@src/utils/tokens";
import { AuthMiddleware } from "@src/middlewares/lib/authorization";


export async function bootstrap(): Promise<Container> {
  return new Promise<Container>((resolve, reject) => {
    try {
      const container = new Container();

      container
        .bind<Server>(EXPRESS_SERVER_TOKEN)
        .to(ExpressServer)
        .inSingletonScope();

      container
        .bind<Logger>(PINO_TOKEN)
        .to(PinoLogger)
        .inSingletonScope();
      container
        .bind<Database>(POSTGRES_TOKEN)
        .to(Postgres)
        .inSingletonScope();

      container
        .bind<PostgresRepository>(PRODUCTS_REPOSITORY)
        .to(ProductsRepository)
        .inSingletonScope();
      container
        .bind<PostgresRepository>(USERS_REPOSITORY)
        .to(UsersRepository)
        .inSingletonScope();

      container
        .bind<AuthMiddleware>(AUTH_MIDDLEWARE)
        .to(AuthMiddleware)
        .inRequestScope()

      container
        .bind<UserService>(USERS_SERVICE_TOKEN)
        .to(UserService)
        .inRequestScope();
      container
        .bind<ProductsService>(PRODUCTS_SERVICE_TOKEN)
        .to(ProductsService)
        .inRequestScope();

      resolve(container);
    } catch (error) {
      reject(new Error("Failed to bootstrap: " + error));
    }
  });
}