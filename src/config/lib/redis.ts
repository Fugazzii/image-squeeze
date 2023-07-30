import { CacheMemory, Logger } from "@src/interfaces";
import { PINO_TOKEN } from "@src/utils/tokens";
import { injectable, inject } from "inversify";
import Redis from "ioredis";

@injectable()
export class RedisCache implements CacheMemory {
  private client: Redis;

  public constructor(
    @inject(PINO_TOKEN) private readonly logger: Logger
  ) {
    this.client = new Redis({
      host: process.env.SERVER_HOST as string,
      port: process.env.REDIS_PORT as any
    });
  }

  public async connect() {
    try {
      // await this.client.connect();
      console.log("Connected to Redis server.");
    } catch (error) {
      console.error("Could not connect to redis:", error);
    }
  }
  
  public add(key: string, value: any): void;
  public add(key: string, value: any, expiration: number): void;
  public add(key: string, value: any, expiration?: number): void {
    this.client.set(key, JSON.stringify(value));

    if (expiration !== undefined) {
      this.client.expire(key, expiration);
    }
  }


  public async get(key: string) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  public remove(key: string) {
    this.client.del(key);
  }
}
