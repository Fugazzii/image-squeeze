import { Logger, PostgresRepository, UserInterface, UserLoginInterface, UserRegisterInterface } from "@src/interfaces";
import { PINO_TOKEN, USERS_REPOSITORY } from "@src/utils/tokens";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";

@injectable()
export class UserService {
    
    private readonly jwt_expires: number;
    private readonly jwt_secret: string;

    public constructor(
        @inject(USERS_REPOSITORY) private readonly usersRepository: PostgresRepository,
        @inject(PINO_TOKEN) private readonly logger: Logger
    ) {
        this.jwt_expires = 7 * 24 * 60 * 60;
        this.jwt_secret = process.env.JWT_SECRET as string;
    }

    public async register({ username, email, pwd }: UserRegisterInterface) {
        try {
            const exists = Boolean(await this.usersRepository.findOne(email));

            if(exists) {
                throw new Error("User already exists");
            }

            const newUserEmail: string = await this.usersRepository.insert({
                username, email, pwd
            });

            let token = jwt.sign(
                { email: newUserEmail }, 
                this.jwt_secret, 
                { expiresIn: this.jwt_expires }
            );

            return token;
        } catch (error) {
            this.logger.error("Error during registering user");
            this.logger.error(error);
            throw error;
        }
    }

    public async login({ email, pwd }: UserLoginInterface) {
        const user = await this.usersRepository.findOne(email);

        if(!user) throw new Error("User not found");

        try {
            const isMatch = user.pwd === pwd;
        
            if(!isMatch) throw new Error("Passwords does not match!");
    
            let token = jwt.sign({ email }, this.jwt_secret, { expiresIn: this.jwt_expires })
    
            return token;                
        } catch (error) {
            throw error;
        }
    }

    public findAll(): Promise<Array<UserInterface>> {
        return this.usersRepository.findAll();
    }

    public findOne(id: number): Promise<any>;
    public findOne(email: string): Promise<any>;
    public findOne(arg: number | string): Promise<any> {
        return this.usersRepository.findOne(arg);
    }

    public deleteOne(id: number): Promise<any>;
    public deleteOne(email: string): Promise<any>;
    public deleteOne(arg: number | string): Promise<any> {
        return this.usersRepository.deleteOne(arg);
    }

    public ping(): string {
        return this.usersRepository.ping();
    }
}
