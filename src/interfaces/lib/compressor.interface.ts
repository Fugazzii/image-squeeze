export interface Compressor {
    compress(file: Express.Multer.File, quality: number): Promise<Express.Multer.File>;   
}