// membutuhkan data dari database
// dibuat terlebih dahulu di folder configs

import { QueryResult } from "pg";
import db from "../configs/pg";
import { IdataProduct, IproductBody, IproductQuery, Sort } from "../models/product";

export const getAllProduct = (
    product_name?: string,
    category?: string,
    min_price?: number,
    max_price?: number,
    sort?: Sort,
    limit?: number, // Jumlah batas item per halaman
    offset?: number // Nomor item mulai dari
): Promise<QueryResult<IdataProduct>> => {
    let query = `SELECT                    
                    product_name as "product name",
                    price,
                    category,
                    description,                    
                    uuid
                FROM product
                WHERE is_deleted = false`;

    const values: any[] = [];
    const conditions: string[] = [];

    if (product_name) {
        conditions.push(`      product_name ILIKE $${conditions.length + 1}`);
        values.push(`%${product_name}%`);
    }

    if (category) {
        conditions.push(`category = $${conditions.length + 1}`);
        values.push(category);
    }

    if (min_price) {
        conditions.push(`price >= $${conditions.length + 1}`);
        values.push(min_price);
    }

    if (max_price) {
        conditions.push(`price <= $${conditions.length + 1}`);
        values.push(max_price);
    }

    if (conditions.length > 0) {
        query += ` AND ` + conditions.join(' AND ');
    }    

    const sorts: string[] = [];

    if (sort) {
        switch (sort) {
            case "a-z":
                sorts.push(`product_name ASC`);
                break;
            case "z-a":
                sorts.push(`product_name DESC`);
                break;
            case "cheapest":
                sorts.push(`price ASC`);
                break;
            case "priciest":
                sorts.push(`price DESC`);
                break;
            case "oldest":
                sorts.push(`created_at ASC`);
                break;
            case "newest":
                sorts.push(`created_at DESC`);
                break;
            default:
                console.log("Invalid sort parameter");
        }
    }

    if (sorts.length === 0) {
        sorts.push(`id ASC`);
    }

    query += ` ORDER BY ` + sorts.join(', ');

    // Pagination
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

export const getOneProduct = (uuid: string): Promise<QueryResult<IdataProduct>> => {
    const query =
        `SELECT
            product_name as "product name",
            price,
            category,
            description,
            uuid
        FROM product WHERE uuid=$1`;
    const values = [uuid];
    return db.query(query, values);
};

export const createProduct = (body: IproductBody): Promise<QueryResult<IdataProduct>> => {
    const query =
            `INSERT INTO product (product_name, price, category, description)
            VALUES ($1, $2, $3, $4)
            RETURNING
                product_name as "product name",
                price,
                category,
                description,                    
                uuid`;
    const { product_name, price, category, description } = body;
    const values = [product_name, price, category, description];
    return db.query(query, values);
};

export const getCategories = (): Promise<QueryResult<IproductQuery>> => {
    const query = `SELECT DISTINCT category FROM product`;
    return db.query(query);
};

export const updateProduct = (
    uuid: string,
    body: Partial<IproductBody>
): Promise<QueryResult<IdataProduct>> => {
    let query = `UPDATE product SET `;
    const values: any[] = [];
    let index = 1;

    if (body.product_name) {
        query += `product_name = $${index}, `;
        values.push(body.product_name);
        index++;
    }
    if (body.price) {
        query += `price = $${index}, `;
        values.push(body.price);
        index++;
    }
    if (body.category) {
        query += `category = $${index}, `;
        values.push(body.category);
        index++;
    }
    if (body.description) {
        query += `description = $${index}, `;
        values.push(body.description);
        index++;
    }

    query += `updated_at = NOW()
    WHERE uuid = $${index}
    RETURNING
        product_name as "product name",
        price,
        category,
        description,                    
        uuid`;
    values.push(uuid);

    return db.query(query, values);
};

export const updateProductSoftDelete = (uuid: string): Promise<QueryResult<IdataProduct>> => {
    const query = `
        UPDATE product
        SET is_deleted = TRUE
        WHERE uuid = $1
        RETURNING product_name as "product name", is_deleted;
    `;
    return db.query(query, [uuid]);
};





