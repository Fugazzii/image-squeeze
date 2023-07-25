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

    public async register({ username, email, password }: UserRegisterInterface) {
        try {
            const exists = Boolean(await this.usersRepository.findOne(email));

            if(exists) {
                throw new Error("User already exists");
            }

            const newUserEmail: string = await this.usersRepository.insert(username, email, password);

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

    public async login({ email, password }: UserLoginInterface) {
        const user = await this.usersRepository.findOne(email);

        if(!user) {
            throw new Error("User not found");
        }

        console.log(user);

        const isMatch = user.pwd === password;
        
        if(!isMatch) {
            throw new Error("Passwords does not match!");
        }

        this.logger.warn("before token");

        let token = jwt.sign({ email }, this.jwt_secret, { expiresIn: this.jwt_expires })

        this.logger.warn(token);

        return token;
    }

    public async findAll(): Promise<Array<UserInterface>> {
        return await this.usersRepository.findAll();
    }

    public ping(): string {
        return this.usersRepository.ping();
    }
}