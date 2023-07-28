import { Response, Request } from "express";
import { inject } from "inversify";
import jwt from "jsonwebtoken";

import { AuthMiddleware, Filehandler } from "@src/middlewares";
import { ProductsService } from "@src/services";
import { CloudService, Compressor, Controller, Logger, Server } from "@src/interfaces";

import { 
    PINO_TOKEN, 
    AUTH_MIDDLEWARE, 
    PRODUCTS_SERVICE_TOKEN, 
    FILEHANDLER_MIDDLEWARE, 
    S3_SERVICE_TOKEN, 
    RUST_COMPRESSOR_TOKEN 
} from "@src/utils/tokens";

export class ProductsController implements Controller {

    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger,
        @inject(PRODUCTS_SERVICE_TOKEN) private readonly productService: ProductsService,
        @inject(AUTH_MIDDLEWARE) private readonly authMiddleware: AuthMiddleware,
        @inject(FILEHANDLER_MIDDLEWARE) private readonly filehandlerMiddleware: Filehandler
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

    public async findAll(req: Request, res: Response) {
        if(!req.body) this.logger.error("Request body is undefined");
        
        try {
            const data = await this.productService.findAll();
            
            return res.status(200).json({
                success: true,
                data,
                message: "Successfully fetched users!"
            });
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({
                success: false,
                data: null,
                message: "Failed to fetch products"
            });
        }   
    }

    public async findOne(req: Request, res: Response) {
        if(!req.body) this.logger.error("Request body is undefined");
        
        try {
            const data = await this.productService.findOne(Number(req.params.id));
            
            return res.status(200).json({
                success: true,
                data,
                message: "Successfully fetched users!"
            });
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({
                success: false,
                data: null,
                message: "Failed to fetch product"
            });
        }  
    }

    public async addProduct(req: Request, res: Response) {
        if(!req.file) {
            this.logger.error("Request file is empty")
            return res.status(422).json({
                success: false,
                data: null,
                message: "Request file is empty"
            });
        }
        if(!req.body) {
            this.logger.error("Request body is empty");
            return res.status(422).json({
                success: false,
                data: null,
                message: "Request body is empty"
            });
        }
        
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
            
            return res.status(200).json({
                success: true,
                data,
                message: "Successfully added users!"
            });
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({
                success: false,
                data: null,
                message: "Failed to add products"
            });
        }  
    }
}