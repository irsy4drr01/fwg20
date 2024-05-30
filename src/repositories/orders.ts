import { QueryResult } from "pg";
import db from "../configs/pg";
import { IdataOrder, IorderBody } from "../models/orders";

export const getAllOrders = (): Promise<QueryResult<IdataOrder>> => {
    const query =
        `SELECT        
        orders.order_number,        
        users.username AS user_name,        
        promo.promo_code AS promo_name,
        orders.subtotal,
        orders.total_amount,
        orders.order_date,
        orders.status
    FROM orders
    LEFT JOIN users ON orders.user_id = users.id
    LEFT JOIN promo ON orders.promo_id = promo.id
    WHERE orders.is_deleted = false`;
    return db.query(query);
};

export const getOneOrder = (order_number: string): Promise<QueryResult<IdataOrder>> => {
    const query =
        `SELECT
            orders.order_number,        
            users.username AS user_name,        
            promo.promo_code AS promo_name,
            orders.subtotal,
            orders.total_amount,
            orders.order_date,
            orders.status
        FROM orders
        LEFT JOIN users ON orders.user_id = users.id
        LEFT JOIN promo ON orders.promo_id = promo.id
        WHERE order_number = $1`;
    const values = [order_number];
    return db.query(query, values);
};

export const createOrder = (body: IorderBody): Promise<QueryResult<any>> => {
    const query = 
        `INSERT INTO orders (order_number, user_id, promo_id, subtotal, total_amount, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;
    const { order_number, user_id, promo_id, subtotal, total_amount, status } = body;
    const values = [order_number, user_id, promo_id, subtotal, total_amount, status];
    return db.query(query, values);
};

export const updateOrder = (
    order_number: string,
    body: Partial<IorderBody>
): Promise<QueryResult<any>> => {
    const query =
        `UPDATE orders
        SET
            order_number = COALESCE($1, order_number),
            user_id = COALESCE($2, user_id),
            promo_id = COALESCE($3, promo_id),
            subtotal = COALESCE($4, subtotal),
            total_amount = COALESCE($5, total_amount),
            status = COALESCE($6, status)
        WHERE order_number = $7
        RETURNING *`;
    const { order_number: newOrderNumber, user_id, promo_id, subtotal, total_amount, status } = body;
    const values = [newOrderNumber, user_id, promo_id, subtotal, total_amount, status, order_number];
    return db.query(query, values);
};

export const softDeleteOrder = (order_number: string): Promise<QueryResult<any>> => {
    const query =
        `UPDATE orders
        SET is_deleted = true
        WHERE order_number = $1
        RETURNING order_number`;
    const values = [order_number];
    return db.query(query, values);
};

