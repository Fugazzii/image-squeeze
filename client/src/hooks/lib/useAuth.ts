import { UserInterface } from "@src/interfaces";
import { useState } from "react";

export function useAuth() {
    const [user, setUser] = useState<UserInterface | null>(null);
    const [token, setToken] = useState<string | null>(null);

    return { user, setUser, token, setToken };
}
