import { Server } from "@src/interfaces";
import { Controller } from "@src/interfaces/lib/controller.interface";
import { UserService } from "@src/services";
import { USERS_SERVICE_TOKEN } from "@src/utils/tokens";
import { NextFunction, Response } from "express";
import { inject } from "inversify";

export class UserController implements Controller {
    
    public constructor(
        @inject(USERS_SERVICE_TOKEN) private readonly userService: UserService
    ) {}

    public registerRoutes(server: Server) {
        server.get("/ping", this.ping.bind(this));
        server.post("/register", this.register.bind(this));
        server.post("/login", this.login.bind(this));
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        if(req.method != "POST") throw new Error("Wrong method!");
        console.log(req);
        const { username, email, password } = req.body as any;

        const newUser = await this.userService.register(username, email, password);
        return newUser;
    }

    public login(req: Request, res: Response, next: NextFunction) {
        /* TODO: Login user */
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