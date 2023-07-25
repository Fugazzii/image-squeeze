export interface UserInterface {
    email: string;
    pwd: string;
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
    pwd: string;
}

export interface UserRegisterInterface {
    email: string;
    pwd: string;
    username: string;
}