import { AuthMiddleware, Filehandler } from "@src/middlewares";
import { ProductsService, S3Service } from "@src/services";
import { PINO_TOKEN, AUTH_MIDDLEWARE, PRODUCTS_SERVICE_TOKEN, FILEHANDLER_MIDDLEWARE, S3_SERVICE_TOKEN, RUST_COMPRESSOR_TOKEN } from "@src/utils/tokens";
import { inject } from "inversify";
import { Compressor, Controller, Logger, Server } from "@src/interfaces";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";

export class ProductsController implements Controller {

    private readonly qualities: Array<number>;


    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger,
        @inject(PRODUCTS_SERVICE_TOKEN) private readonly productService: ProductsService,
        @inject(AUTH_MIDDLEWARE) private readonly authMiddleware: AuthMiddleware,
        @inject(FILEHANDLER_MIDDLEWARE) private readonly filehandlerMiddleware: Filehandler,
        @inject(S3_SERVICE_TOKEN) private readonly s3Service: S3Service,
        @inject(RUST_COMPRESSOR_TOKEN) private readonly compressorService: Compressor
    ) {
        this.qualities = new Array<number>(1080, 720, 480, 360);
    }

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
            await this.compressAndUpload(req.file);

            const { title, img, price, quantity } = req.body;

            const data = await this.productService.insert({
                title, 
                img, 
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

    private async compressAndUpload(file: Express.Multer.File) {
        const compressAndUploadTasks = this.qualities.map(async (quality) => {
            const compressedImage = await this.compressorService.compress(file, quality);
            compressedImage.originalname = `${quality.toString()}_${compressedImage.originalname}`;

            const location = await this.s3Service.upload(compressedImage);
            return location;
        });
        
        try {
            const uploadedLocations = await Promise.all(compressAndUploadTasks);
            this.logger.info("Files has been successfully uploaded to s3.");
            console.log(uploadedLocations);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}