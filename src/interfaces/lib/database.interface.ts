export interface Database {
    connect(): Promise<NonNullable<any>>;
    build(): Promise<void>;
}