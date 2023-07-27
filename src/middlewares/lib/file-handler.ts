import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import multer from "multer";
import AWS from "aws-sdk";

// interface RequestWithImage extends Request {
//   files: {
//     img: Express.Multer.File;
//   };
// }

@injectable()
export class Filehandler {
  private upload: multer.Multer;

  public constructor() {
    const storage = multer.memoryStorage(); // Use memory storage instead of saving to the local disk

    this.upload = multer({ storage });
  }

  public single = (req: Request, res: Response, next: NextFunction) => {
    this.upload.single("img")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err);
        next(err);
      } else if (err) {
        console.error("Error in multer middleware:", err);
        next(err);
      } else {
        next();
      }
    });
  };

  public uploadToS3 = async (file: any): Promise<string> => {
    try {
      const s3 = new AWS.S3();
      const bucketName = "ecommerce-ilia"; // Replace with your S3 bucket name
      const s3Key = `uploads/${file.file.originalname}`; // Specify the desired key/filename in the S3 bucket

      const params: AWS.S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: s3Key,
        Body: file.file.buffer, // Use file.buffer to access the file data uploaded by multer
        ContentType: file.mimetype,
        ACL: "public-read"
      };

      const s3Response = await s3.upload(params).promise();
      return s3Response.Location; // Return the S3 URL of the uploaded file
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
