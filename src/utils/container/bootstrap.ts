import { Container } from "inversify";

import { PinoLogger, ProductsService, RustCompressor, S3Service, UserService } from "@src/services/";
import { ExpressServer, Postgres } from "@src/config";
import { ProductsRepository, UsersRepository } from "@src/repositories/";
import { Server, Database, Logger, PostgresRepository, Compressor, CloudService } from "@src/interfaces";

import { 
  AUTH_MIDDLEWARE,
  EXPRESS_SERVER_TOKEN, 
  FILEHANDLER_MIDDLEWARE, 
  PINO_TOKEN, 
  POSTGRES_TOKEN, 
  PRODUCTS_REPOSITORY, 
  PRODUCTS_SERVICE_TOKEN, 
  RUST_COMPRESSOR_TOKEN, 
  S3_SERVICE_TOKEN, 
  USERS_REPOSITORY, 
  USERS_SERVICE_TOKEN
} from "@src/utils/tokens";
import { Filehandler, AuthMiddleware } from "@src/middlewares";
import { ErrorHandler } from "../handlers";

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
        .bind<Filehandler>(FILEHANDLER_MIDDLEWARE)
        .to(Filehandler)
        .inSingletonScope()

      container
        .bind<CloudService>(S3_SERVICE_TOKEN)
        .to(S3Service)
        .inRequestScope()

      container
        .bind<Compressor>(RUST_COMPRESSOR_TOKEN)
        .to(RustCompressor)
        .inRequestScope()

      container
        .bind<UserService>(USERS_SERVICE_TOKEN)
        .to(UserService)
        .inRequestScope();
      container
        .bind<ProductsService>(PRODUCTS_SERVICE_TOKEN)
        .to(ProductsService)
        .inRequestScope();

      container
        .bind<ErrorHandler>(ErrorHandler)
        .to(ErrorHandler)
        .inRequestScope();

      resolve(container);
    } catch (error) {
      reject(new Error("Failed to bootstrap: " + error));
    }
  });
}