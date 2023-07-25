import express, { Application, NextFunction, Request, Response, Router } from "express";
import { Server } from "@src/interfaces";
import { injectable } from "inversify";

@injectable()
export class ExpressServer implements Server {
    private readonly server: Application;
    private readonly router: Router;

    public constructor() {
        this.server = express();
        this.router = express.Router();
        this.server.use(express.json());
        this.server.use(this.router);
    }

    public listen(port: number, cb: () => void) {
        this.server.listen(port, cb);
    }

    public get(path: string, cb: any) {
        this.router.get(path, cb);
    }

    public post(path: string, cb: any) {
        this.router.post(path, cb);
    }

    public delete(path: string, cb: any) {
        this.router.delete(path, cb);
    }

    public put(path: string, cb: any) {
        this.router.put(path, cb);
    }

    public use() {
        this.server.use(this.router);
    }
}
