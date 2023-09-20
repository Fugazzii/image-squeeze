export interface ProductInterface {
    id: number,
    title: string,
    img: File,
    quantity: number,
    price: number,
    postedAt: Date
}

export interface AddProductInterface {
    title: string,
    img: File,
    quantity: number,
    price: number
}