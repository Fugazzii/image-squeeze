import { Logger, Server, Controller } from "@src/interfaces";
import { AuthMiddleware } from "@src/middlewares";
import { UserService } from "@src/services";
import { NextFunction, Response, Request } from "express";
import { inject } from "inversify";

import { 
    AUTH_MIDDLEWARE, 
    ERROR_HANDLER, 
    PINO_TOKEN,
    RESPONSE_HANDLER,
    USERS_SERVICE_TOKEN
} from "@src/utils/tokens";
import { ErrorHandler, ResponseHandler } from "@src/utils/handlers";

export class UserController implements Controller {
    
    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger,
        @inject(USERS_SERVICE_TOKEN) private readonly userService: UserService,
        @inject(AUTH_MIDDLEWARE) private readonly authMiddleware: AuthMiddleware,
        @inject(ERROR_HANDLER) private readonly errorHandler: ErrorHandler,
        @inject(RESPONSE_HANDLER) private readonly responseHandler: ResponseHandler
    ) {}

    public registerRoutes(server: Server) {
        server.get("/ping", this.ping.bind(this));
        server.post("/register", this.register.bind(this));
        server.post("/login", this.login.bind(this));
        server.get(
            "/users", 
            this.authMiddleware.isAuth.bind(this),
            this.findAll.bind(this)
        );
        server.get(
            "/user/:id", 
            this.authMiddleware.isAuth.bind(this),
            this.findOne.bind(this)
        );
        server.delete(
            "/user/:id", 
            this.authMiddleware.isAuth.bind(this), 
            this.deleteOne.bind(this)    
        );
    }

    public async register(req: Request, res: Response, _next: NextFunction) {
        if(!req || !req.method || req.method !== "POST") return new Error("Wrong method!");
        if(!req.body) this.logger.error("Request body is undefined");

        try {
            const { body: { username, email, pwd } } = req as any;

            await this.userService.register({ username, email, pwd });
            
            return this.responseHandler.NewUserRegisteredResponse(res, { username, email });
        } catch (error) {
            return this.errorHandler.UnsuccessfulRegistrationException(res, error);
        }
    }

    public async login(req: Request, res: Response, _next: NextFunction) {
        if(req.method !== "POST") return new Error("Wrong method!");
        if(!req.body) this.logger.error("Request body is undefined");

        try {
            const { email, pwd } = req.body as any;
            const token = await this.userService.login({ email, pwd });
            
            return this.responseHandler.SuccessfulLoginResponse(res, token);
        } catch (error) {
            return this.errorHandler.UnsuccessfulLoginException(res, error);
        }
    }

    public async findAll(req: Request, res: Response, _next: NextFunction) {
        try {
            const users = await this.userService.findAll();
                
            return this.responseHandler.FetchedAllDataResponse(res, users);
        } catch (error) {
            return this.errorHandler.FailedToFetchException(res, error);
        }
    }

    public async findOne(req: Request, res: Response) {
        try {
            const { params: { id } } = req;
            const user = await this.userService.findOne(id);
            
            return this.responseHandler.FoundDataResponse(res, user);
        } catch (error) {
            return this.errorHandler.NotFoundTargetException(res, error);
        }
    }

    public async deleteOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            this.logger.info(`Deleting user with id... ${id}`);

            const deleted = this.userService.deleteOne(id);
            
            return this.responseHandler.DeletedDataResponse(res, deleted);
        } catch (error) {
            return this.errorHandler.FailedDeleteException(res, error);
        }
        
    }

    private ping(_req: Request, res: Response) {
        try {
            const response = this.userService.ping();
            return res.status(200).json(response);
        } catch (error) {
            return this.errorHandler.InternalServerErrorException(res, error);
        }
    }

}