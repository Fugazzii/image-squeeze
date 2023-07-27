import { Logger } from "@src/interfaces";
import { PINO_TOKEN } from "@src/utils/tokens";
import AWS from "aws-sdk";
import { injectable, inject } from "inversify";

@injectable()
export class S3Service {

    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger
    ) {}

    public upload = async (file: any): Promise<string> => {
      try {
        const s3 = new AWS.S3();
        const bucketName = "ecommerce-ilia";
        const s3Key = `uploads/${file.originalname}`;
  
        const params: AWS.S3.PutObjectRequest = {
          Bucket: bucketName,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read"
        };
  
        const s3Response = await s3.upload(params).promise();
        return s3Response.Location;
      } catch (error) {
        this.logger.error(error);
        throw error;
      }
    };
}