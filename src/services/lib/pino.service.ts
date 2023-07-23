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

  public info(msg: string): void {
    this.logger.info(msg);
  }

  public error(msg: string): void {
    this.logger.error(msg);
  }

  public warn(msg: string): void {
    this.logger.warn(msg);
  }

  public debug(msg: string): void {
    this.logger.debug(msg);
  }
}
