export interface IorderBody {
    order_number: string;
    user_id: number;
    promo_id?: number;
    subtotal: number;
    total_amount: number;
    status: string;
}

export interface IdataOrder {
    order_number: string;
    user_name: string;
    promo_name?: string;
    subtotal: number;
    total_amount: number;
    order_date: Date;
    status: string;
}

export interface IorderParams {
    order_number: string;
}
