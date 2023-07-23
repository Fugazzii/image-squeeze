import { Client } from "pg";

export interface Database {
    connect(): Promise<Client>;
    createTables(): Promise<void>;
}