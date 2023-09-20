import { UserInterface, UserLoginInterface } from "@src/interfaces";

const host = import.meta.env.VITE_SERVER_HOST;

export async function register(user: UserInterface) {
    const response = await fetch(`${host}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    const data = await response.json();
    return data;
}

export async function login(user: UserLoginInterface) {
    const response = await fetch(`${host}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    const data = await response.json();
    return data;
}
