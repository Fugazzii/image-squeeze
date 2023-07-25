import { PostgresRepository } from "@src/interfaces";
import { USERS_REPOSITORY } from "@src/utils/tokens";

import { NextFunction, Request } from "express";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";

interface Req extends Request {
    user: any;
}

@injectable()
export class AuthMiddleware {
    
    public constructor(
        @inject(USERS_REPOSITORY) private readonly userRepository: PostgresRepository
    ) {}

    public isAuth = async (req: Req, res: Response, next: NextFunction) => {
        let token: string | null = null;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(` `)[1];
        }
    
        if(!token) {
            return next(new Error("Not authorized"));
        }

        try {
            const decoded = jwt.verify(
                token, 
                process.env.JWT_SECRET as string
            ) as jwt.JwtPayload;

            const user = await this.userRepository.findOne(decoded.email);
            
            if(!user) {
                return next(new Error('User does not exist'));
            }

            req.user = user;
            next();
        } catch (error) {
            return next(new Error(`Not authorized. ${error}`));
        }
    }
}
