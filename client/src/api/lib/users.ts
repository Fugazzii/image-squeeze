const host = import.meta.env.VITE_SERVER_HOST;

export async function findUsers(token: string) {
    const response = await fetch(`${host}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return data;
}

export async function findOneUser(token: string) {
    const response = await fetch(`${host}/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return data;
}

export async function insertOneUser(token: string) {
    const response = await fetch(`${host}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return data;
}

export async function deleteOneUser(token: string) {
    const response = await fetch(`${host}/user`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return data;
}
