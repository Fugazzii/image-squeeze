import { Container } from "inversify";

import { PinoLogger, ProductsService, RustCompressor, S3Service, UserService } from "@src/services/";
import { ExpressServer, Postgres, RedisCache } from "@src/config";
import { ProductsRepository, UsersRepository } from "@src/repositories/";
import { Server, Database, Logger, PostgresRepository, Compressor, CloudService, CacheMemory } from "@src/interfaces";

import { Filehandler, AuthMiddleware } from "@src/middlewares";
import { ErrorHandler, ResponseHandler } from "../handlers";

import { 
  AUTH_MIDDLEWARE,
  ERROR_HANDLER,
  EXPRESS_SERVER_TOKEN, 
  FILEHANDLER_MIDDLEWARE, 
  PINO_TOKEN, 
  POSTGRES_TOKEN, 
  PRODUCTS_REPOSITORY, 
  PRODUCTS_SERVICE_TOKEN, 
  REDIS_TOKEN, 
  RESPONSE_HANDLER, 
  RUST_COMPRESSOR_TOKEN, 
  S3_SERVICE_TOKEN, 
  USERS_REPOSITORY, 
  USERS_SERVICE_TOKEN
} from "@src/utils/tokens";

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
        .bind<CacheMemory>(REDIS_TOKEN)
        .to(RedisCache)
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
        .bind<ErrorHandler>(ERROR_HANDLER)
        .to(ErrorHandler)
        .inSingletonScope();

      container
        .bind<ResponseHandler>(RESPONSE_HANDLER)
        .to(ResponseHandler)
        .inSingletonScope();

      resolve(container);
    } catch (error) {
      reject(new Error("Failed to bootstrap: " + error));
    }
  });
}