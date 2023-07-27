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
                file.buffer.toString("base64"),
                quality.toString()
            ];

            const rustService = spawn(rustServiceCommand, args);

            const compressedImageData: Uint8Array[] = [];

            rustService.stdout.on("data", (data: Uint8Array) => {
                console.log("Data", data);
                compressedImageData.push(data);
            });

            rustService.on("error", (error) => {
                console.error("Rust Service Error:", error);
                reject(error);
            });              

            rustService.on("close", (code) => {
                if (code === 0) {
                    const compressedImageBuffer = Buffer.concat(compressedImageData);

                    file.buffer = compressedImageBuffer;

                    resolve(file);
                } else {
                    reject(new Error("Failed to compress image."));
                }
            });

            rustService.on("error", (error) => {
                reject(error);
            });
        });
    }
}
