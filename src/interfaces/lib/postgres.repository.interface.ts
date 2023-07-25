export interface PostgresRepository {
    ping(): string;
    insert(...args: any): Promise<any>;
    delete(...args: any): Promise<any>;
    update(...args: any): Promise<any>;
    findOne(id: number): Promise<any>;
    findOne(email: string): Promise<any>;
    findAll(): Promise<Array<any>>;
}