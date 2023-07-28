import { Compressor } from "@src/interfaces";
import { injectable } from "inversify";
import { spawn } from "child_process";

@injectable()
export class RustCompressor implements Compressor {

    public constructor() { }

    public async compress(file: Express.Multer.File, quality: number): Promise<Express.Multer.File> {
        return new Promise((resolve, reject) => {
            const rustServiceCommand = "./compressor";

            const args = [
                `./uploads/${file.originalname}`,
                quality.toString()
            ];

            const rustService = spawn(rustServiceCommand, args);
            
            rustService.stdout.on("data", (data) => {
                console.log(data.toString());
            })

            rustService.on("error", (error) => {
                console.error("Rust Service Error:", error);
                reject(error);
            });              

            rustService.on("close", () => {
                resolve(file);
            });
        });
    }
}
