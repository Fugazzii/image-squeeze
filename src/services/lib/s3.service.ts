import { CloudService, Logger } from "@src/interfaces";
import { PINO_TOKEN } from "@src/utils/tokens";
import AWS from "aws-sdk";
import { injectable, inject } from "inversify";

@injectable()
export class S3Service implements CloudService {

  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  public constructor(
      @inject(PINO_TOKEN) private readonly logger: Logger
  ) {
    this.s3 = new AWS.S3();
    this.bucketName  = "ecommerce-ilia";
  }

  public upload = async (file: any): Promise<string> => {
    try {
      const s3Key = `uploads/${file.originalname}`;

      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
      };

      const s3Response = await this.s3.upload(params).promise();

      return s3Response.Location;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  };

  public getImageUrl = (s3Key: string): string => {
    try {
      const params: AWS.S3.GetObjectRequest = {
        Bucket: this.bucketName,
        Key: s3Key
      };

      const imageUrl = this.s3.getSignedUrl("getObject", params);

      return imageUrl;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  };
}