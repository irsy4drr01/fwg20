export interface IpromoBody {
    promo_code: string;
    discount: number;
    min_purchase_amount: number;
    start_date: string;
    end_date: string;
    uuid: string;
}

export interface IpromoParams {
    promo_code: string;
}

export interface IpromoQuery {
    limit?: number;
    page?: number;
}

export interface IdataPromo {
    promo_code: string;
    discount: number;
    min_purchase_amount: number;
    start_date: string;
    end_date: string;
}