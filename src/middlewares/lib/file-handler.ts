import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import multer from "multer";

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
}
