export interface UserInterface {
    email: string;
    password: string;
    username: string;
    balance: number;
}

export interface UserInterfaceForClient {
    email: string;
    username: string;
    balance: number;
}

export interface UserLoginInterface {
    email: string;
    password: string;
}

export interface UserRegisterInterface {
    email: string;
    password: string;
    username: string;
}