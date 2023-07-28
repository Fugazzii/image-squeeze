import { Response, Request } from "express";
import { inject } from "inversify";
import jwt from "jsonwebtoken";

import { AuthMiddleware, Filehandler } from "@src/middlewares";
import { ProductsService } from "@src/services";
import { Controller, Logger, Server } from "@src/interfaces";

import { 
    PINO_TOKEN, 
    AUTH_MIDDLEWARE, 
    PRODUCTS_SERVICE_TOKEN, 
    FILEHANDLER_MIDDLEWARE,
    ERROR_HANDLER,
    RESPONSE_HANDLER
} from "@src/utils/tokens";
import { ErrorHandler, ResponseHandler } from "@src/utils/handlers";

export class ProductsController implements Controller {

    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger,
        @inject(PRODUCTS_SERVICE_TOKEN) private readonly productService: ProductsService,
        @inject(AUTH_MIDDLEWARE) private readonly authMiddleware: AuthMiddleware,
        @inject(FILEHANDLER_MIDDLEWARE) private readonly filehandlerMiddleware: Filehandler,
        @inject(ERROR_HANDLER) private readonly errorHandler: ErrorHandler,
        @inject(RESPONSE_HANDLER) private readonly responseHandler: ResponseHandler
    ) {}

    public registerRoutes(server: Server): void {
        server.get("/products", this.authMiddleware.isAuth.bind(this), this.findAll.bind(this));
        server.get("/product/:id", this.authMiddleware.isAuth.bind(this), this.findOne.bind(this));
        server.post(
            "/product",
            this.authMiddleware.isAuth.bind(this), 
            this.filehandlerMiddleware.single.bind(this),
            this.addProduct.bind(this)
        );
    }

    public async findAll(_req: Request, res: Response) {        
        try {
            const data = await this.productService.findAll();
            
            return this.responseHandler.FetchedAllDataResponse(res, data);
        } catch (error) {
            return this.errorHandler.FailedToFetchException(res, error);
        }   
    }

    public async findOne(req: Request, res: Response) {
        if(!req.body) return this.errorHandler.EmptyBodyException(res);
        
        try {
            const data = await this.productService.findOne(Number(req.params.id));
            
            return this.responseHandler.FoundDataResponse(res, data);
        } catch (error) {
            return this.errorHandler.FailedToFetchException(res, error);
        }  
    }

    public async addProduct(req: Request, res: Response) {
        if(!req.file) return this.errorHandler.EmptyRequestFileException(res);
        if(!req.body) return this.errorHandler.EmptyBodyException(res);
        
        const token = req.headers["authorization"]?.split(" ")[1] as string;
        const secret = process.env.JWT_SECRET as string;
        const user = jwt.verify(token, secret) as jwt.JwtPayload;

        try {
            const [img_xl, img_l, img_m, img_s] = await this.productService.compressAndUpload(req.file);
            const { title, price, quantity } = req.body;

            const data = await this.productService.insert({
                title, 
                img_xl, 
                img_l, 
                img_m,
                img_s,
                price, 
                quantity, 
                author_id: user.id, 
                posted_at: new Date()
            });
            
            return this.responseHandler.AddedDataResponse(res, data);
        } catch (error) {
            return this.errorHandler.FailedToAddException(res, error);
        }  
    }
}