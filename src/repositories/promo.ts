import { QueryResult } from "pg";
import db from "../configs/pg";
import { IpromoBody, IdataPromo } from "../models/promo";

export const getAllPromos = (limit?: number, offset?: number): Promise<QueryResult<IdataPromo>> => {
    let query =
        `SELECT
            promo_code,
            discount,
            min_purchase_amount,
            start_date,
            end_date
        FROM promo
        WHERE is_deleted = false
        ORDER BY id ASC`;

    const values: any[] = [];

    if (limit) {
        query += ` LIMIT $${values.length + 1}`;
        values.push(limit);
    }

    if (offset) {
        query += ` OFFSET $${values.length + 1}`;
        values.push(offset);
    }

    return db.query(query, values);
};

export const getOnePromo = (promo_code: string): Promise<QueryResult<IdataPromo>> => {
    const query =
        `SELECT
            promo_code,
            discount,
            min_purchase_amount,
            start_date,
            end_date
        FROM promo
        WHERE promo_code = $1`;
    const values = [promo_code];
    return db.query(query, values);
};

export const createPromo = (body: IpromoBody): Promise<QueryResult<IdataPromo>> => {
    const query = 
        `INSERT INTO promo (promo_code, discount, min_purchase_amount, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            promo_code,
            discount,
            min_purchase_amount,
            start_date,
            end_date`;
    const { promo_code, discount, min_purchase_amount, start_date, end_date } = body;
    const values = [promo_code, discount, min_purchase_amount, start_date, end_date];
    return db.query(query, values);
};

export const updatePromo = (
    uuid: string,
    body: Partial<IpromoBody>
): Promise<QueryResult<IdataPromo>> => {
    let query = `UPDATE promo SET `;
    const values: any[] = [];
    let index = 1;

    if (body.promo_code) {
        query += `promo_code = $${index}, `;
        values.push(body.promo_code);
        index++;
    }
    if (body.discount) {
        query += `discount = $${index}, `;
        values.push(body.discount);
        index++;
    }
    if (body.min_purchase_amount) {
        query += `min_purchase_amount = $${index}, `;
        values.push(body.min_purchase_amount);
        index++;
    }
    if (body.start_date) {
        query += `start_date = $${index}, `;
        values.push(body.start_date);
        index++;
    }
    if (body.end_date) {
        query += `end_date = $${index}, `;
        values.push(body.end_date);
        index++;
    }

    query += `updated_at = NOW()
    WHERE uuid = $${index}
    RETURNING
        promo_code,
        discount,
        min_purchase_amount,
        start_date,
        end_date,
        updated_at,
        uuid`;
    values.push(uuid);

    return db.query(query, values);
};


export const deletePromo = (promo_code: string): Promise<QueryResult<IdataPromo>> => {
    const query =
        `UPDATE promo
        SET is_deleted = true
        WHERE promo_code = $1
        RETURNING promo_code as "promo code", is_deleted`;    
    return db.query(query, [promo_code]);
};
