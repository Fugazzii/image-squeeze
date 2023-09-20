import { AddProductInterface } from "@src/interfaces";
import axios from "axios";

const host = import.meta.env.VITE_SERVER_HOST;

export async function findProducts(token: string) {
    const response = await fetch(`${host}/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return data;
}

export async function findOneProduct(token: string) {
    const response = await fetch(`${host}/product`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return data;
}

export async function insertOneProduct(token: string, product: AddProductInterface) {
    console.log("Product", product);

    const formdata = new FormData();

    formdata.append("title", product.title);
    formdata.append("img", product.img, product.img.name);
    formdata.append("price", product.price.toString());
    formdata.append("quantity", product.quantity.toString());

    for (var pair of formdata.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
        }
    };

    try {
        const response = await axios.post(`${host}/product`, formdata, config);
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function deleteOneProduct(token: string) {
    const response = await fetch(`${host}/product`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return data;
}
