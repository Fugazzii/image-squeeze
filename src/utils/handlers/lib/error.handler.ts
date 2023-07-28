import { Logger } from "@src/interfaces";
import { PINO_TOKEN } from "@src/utils/tokens";
import { Response } from "express";
import { injectable, inject } from "inversify";

@injectable()
export class ErrorHandler {

    public constructor(
        @inject(PINO_TOKEN) private readonly logger: Logger
    ) {}

    public FailedToFetchException(res: Response, error?: unknown) {
        this.logger.error(error);
        return res.status(500).json({
            success: false,
            error: error,
            message: "Failed to fetch products"
        });
    }

    public FailedToAddException(res: Response, error?: unknown) {
        this.logger.error(error);
        return res.status(500).json({
            success: false,
            error: error,
            message: "Failed to add products"
        });
    }

    public EmptyRequestFileException(res: Response, error?: unknown) {
        this.logger.error(error);
        return res.status(422).json({
            success: false,
            error: error,
            message: "Request file is empty"
        });
    }

    public EmptyBodyException(res: Response, error?: unknown) {
        this.logger.error(error);
        return res.status(422).json({
            success: false,
            error: error,
            message: "Request body is empty"
        });
    }

    public UnsuccessfulRegistrationException(res: Response, error?: unknown) {
        this.logger.error(error);
        return res.status(500).json({ 
            success: false,
            error: error,
            message: "Error while registering user"
        });
    }

    public UnsuccessfulLoginException(res: Response, error?: unknown) {
        this.logger.error(error);
        return res.status(500).json({ 
            success: false,
            error: error,
            message: "Error while logging in"
        });
    }

    public FailedDeleteException(res: Response, error?: unknown) {
        this.logger.error(error);
        return res.status(409).json({
            success: false,
            error: error,
            message: "Failed to delete user"
        });
    }

    public NotFoundTargetException(res: Response, error?: unknown) {
        this.logger.error(error);
        return res.status(409).json({
            success: false,
            error: error,
            message: "Failed to found user"
        });
    }

    public InternalServerErrorException(res: Response, error?: unknown) {
        this.logger.error(error);
        return res.status(500).json({ 
            success: false,
            error: error,
            message: "Internal Server error"
        });
    }
}