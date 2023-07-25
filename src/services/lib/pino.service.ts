import { Logger } from "@src/interfaces";
import { injectable } from "inversify";
import pino from "pino";
import pretty from "pino-pretty";

@injectable()
export class PinoLogger implements Logger {
  private logger: pino.Logger;

  public constructor() {
    this.logger = pino(pretty({
      minimumLevel: "debug"
    }));
  }

  public info(...args: any): void {
    this.logger.info(args.toString());
  }

  public error(...args: any): void {
    this.logger.error(args.toString());
  }

  public warn(...args: any): void {
    this.logger.warn(args.toString());
  }

  public debug(...args: any): void {
    this.logger.debug(args.toString());
  }
}
