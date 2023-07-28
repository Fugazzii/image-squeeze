import { CloudService, Compressor, Logger, PostgresRepository, ProductInterface } from "@src/interfaces";
import { PINO_TOKEN, PRODUCTS_REPOSITORY, RUST_COMPRESSOR_TOKEN, S3_SERVICE_TOKEN } from "@src/utils/tokens";
import { inject, injectable } from "inversify";
import fs from "fs";

@injectable()
export class ProductsService {
    
    private readonly qualities: Array<number>;


    public constructor(
        @inject(PRODUCTS_REPOSITORY) private readonly productsRepository: PostgresRepository,
        @inject(RUST_COMPRESSOR_TOKEN) private readonly compressorService: Compressor,
        @inject(S3_SERVICE_TOKEN) private readonly s3Service: CloudService,
        @inject(PINO_TOKEN) private readonly logger: Logger
    ) {
        this.qualities = new Array<number>(1080, 720, 480, 360);
    }

    public findAll() {
        return this.productsRepository.findAll();
    }

    public findOne(id: number) {
        return this.productsRepository.findOne(id);
    }

    public deleteOne(id: number) {
        return this.productsRepository.deleteOne(id);
    }

    public insert(product: ProductInterface) {
        return this.productsRepository.insert(product);
    }

    public async compressAndUpload(file: Express.Multer.File) {
        const compressAndUploadTasks = this.qualities.map(async (quality) => {
            const filepath = `./uploads/${file.originalname}`;
            const newFilePath = `./uploads/${quality}_${file.originalname}`;
            try {
                await fs.promises.writeFile(filepath, file.buffer);
    
                await this.compressorService.compress(file, quality);

                const compressedImageData = await fs.promises.readFile(newFilePath);

                const compressedImage: any = {
                    fieldname: file.fieldname,
                    originalname: `${quality}_${file.originalname}`,
                    mimetype: file.mimetype,
                    buffer: compressedImageData,
                    size: compressedImageData.length
                };
    
                return this.s3Service.upload(compressedImage);
            } catch (error) {
                console.error("Error during compress and upload:", error);
                throw error;
            }
        });
    
        try {
            const uploadedLocations: Array<string> = await Promise.all(compressAndUploadTasks);
    
            for(let q of this.qualities) {
                await fs.promises.unlink(`./uploads/${q}_${file.originalname}`);
            }
    
            this.logger.info("Files have been successfully uploaded to S3.");
            return uploadedLocations;
        } catch (error) {
            this.logger.error("Error during compress and upload:", error);
            throw error;
        }
    }
    
}