export interface CacheMemory {
    connect(): Promise<any>;
    add(key: string, value: any): void;
    add(key: string, value: any, expiration: number): void;
    get(key: string): Promise<any>;
    remove(key: string): void;
}