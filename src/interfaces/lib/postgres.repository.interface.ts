export interface PostgresRepository {
    ping(): string;
    insert(...args: any): Promise<any>;
    deleteOne(arg: number | string): Promise<any>;
    findOne(arg: number | string): Promise<any>;
    findAll(): Promise<Array<any>>;
}