export interface CloudService {
    upload(file: Express.Multer.File): Promise<any>;
}