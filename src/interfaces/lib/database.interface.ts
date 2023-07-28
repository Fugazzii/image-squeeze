import { Client } from "pg";

export interface Database {
    connect(): Promise<Client>;
    build(): Promise<void>;
}