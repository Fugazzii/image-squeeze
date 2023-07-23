import { PostgresRepository } from "@src/interfaces";
import { USERS_REPOSITORY } from "@src/utils/tokens";
import { inject, injectable } from "inversify";

@injectable()
export class UserService {
    public constructor(
        @inject(USERS_REPOSITORY) private readonly usersRepository: PostgresRepository
    ) {}

    public async register(username: string, email: string, password: string) {
        const response = await this.usersRepository.insert(username, email, password);
        
        if(!response.ok) throw new Error("ERR");

        return response;
    }

    public login() {
        /* Logic */
    }

    public ping(): string {
        return this.usersRepository.ping();
    }
}