import { Logger, Server, Controller, UserLoginInterface } from "@src/interfaces";
import { AuthMiddleware } from "@src/middlewares";
import { UserService } from "@src/services";
import { NextFunction, Response } from "express";
import { inject } from "inversify";

import { 
    AUTH_MIDDLEWARE, 
    PINO_TOKEN,
    USERS_SERVICE_TOKEN
} from "@src/utils/tokens";

export class UserController implements Controller {
    
    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger,
        @inject(USERS_SERVICE_TOKEN) private readonly userService: UserService,
        @inject(AUTH_MIDDLEWARE) private readonly authMiddleware: AuthMiddleware
    ) {}

    public registerRoutes(server: Server) {
        server.get("/ping", this.ping.bind(this));
        server.get("/users", this.findAll.bind(this));
        server.post("/register", this.register.bind(this));
        server.post("/login", this.login.bind(this));
    }

    public async register(req: Request, res: Response, _next: NextFunction) {
        if(!req || !req.method || req.method !== "POST") return new Error("Wrong method!");
        if(!req.body) this.logger.error("Request body is undefined");

        try {
            const { body: { username, email, password } } = req as any;

            const newUser = await this.userService.register({username, email, password});
            
            return res.status(201).json({ 
                success: true,
                data: newUser,
                message: "New user has been added"
            });

        } catch (error) {
            return res.status(500).json({ 
                success: false,
                data: error,
                message: "Error while registering user"
            });
        }
    }

    public async login(req: Request, res: Response, _next: NextFunction) {
        if(req.method !== "POST") return new Error("Wrong method!");
        if(!req.body) this.logger.error("Request body is undefined");

        try {
            const { email, password } = req.body as any;
            const token = await this.userService.login({ email, password });
            return res.status(200).json({
                success: true,
                data: token,
                message: "Signed in successfully"
            });
        } catch (error) {
            this.logger.error(error);
            return res.status(404).json({
                success: false,
                data: error,
                message: "Failed to sign in"
            });
        }
    }

    public async findAll(req: Request, res: Response, _next: NextFunction) {
        try {
            const users = await this.userService.findAll();

            return res.status(200).json({
                success: true,
                data: users,
                message: "Fetched all users"
            });
        } catch (error) {
            this.logger.error(error);
            return res.status(200).json({
                success: false,
                data: [],
                message: "Failed to fetch all users"
            });
        }
    }


    private ping(req: Request, res: Response) {
        try {
            const response = this.userService.ping();
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}