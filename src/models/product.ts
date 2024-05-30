export interface IdataProduct {
    id: number;
    uuid: string;
    product_name: string;
    price: number;
    category: string;
    description: string;
    created_at: string;
    updated_at: string | null;
}

export interface IproductParams {    
    uuid: string;
}

export interface IproductQuery {
    product_name?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
    limit?: number;
    page?: number;
}

export type Sort = 
    "a-z" | 
    "z-a" | 
    "cheapest" | 
    "priciest" | 
    "oldest" | 
    "newest";

export interface IproductBody {
    product_name: string;
    price: number;
    category: string;
    description: string;
}