export interface Server {
    listen(port: number, cb?: () => void): void;
    
    get(path: string, cb: (...args: any) => any): void;
    post(path: string, cb: (...args: any) => any): void;
    delete(path: string, cb: (...args: any) => any): void;
    put(path: string, cb: (...args: any) => any): void;
}