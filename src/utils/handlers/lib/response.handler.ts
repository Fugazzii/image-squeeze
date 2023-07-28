import { Response } from "express";
import { injectable } from "inversify";

@injectable()
export class ResponseHandler {
  
    public constructor() {}

    public NewUserRegisteredResponse(res: Response, data?: any) {
        return res.status(201).json({
            success: true,
            data: data,
            message: "New user has been added",
        });
    }

    public SuccessfulLoginResponse(res: Response, data?: any) {
        return res.status(200).json({
            success: true,
            data: data,
            message: "Signed in successfully",
        });
    }

    public FetchedAllDataResponse(res: Response, data?: any) {
        return res.status(200).json({
            success: true,
            data: data,
            message: "Fetched all data",
        });
    }

    public FoundDataResponse(res: Response, data?: any) {
        return res.status(200).json({
            success: true,
            data: data,
            message: "Successfully found data",
        });
    }

    public DeletedDataResponse(res: Response, data?: any) {
        return res.status(200).json({
            success: true,
            data: data,
            message: "Successfully deleted data",
        });
    }

    public AddedDataResponse(res: Response, data?: any) {
        return res.status(200).json({
            success: true,
            data,
            message: "Successfully added data!"
        });
    }

}
