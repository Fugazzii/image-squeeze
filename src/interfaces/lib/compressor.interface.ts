export interface Compressor {
    compress(file: any, quality: number): Promise<any>;   
}