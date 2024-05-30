import { QueryResult } from "pg";
import db from "../configs/pg";
import { IdataUser, IuserBody, IuserRegisterBody} from "../models/users";

export const getAllUsers = (limit?: number, offset?: number): Promise<QueryResult<IdataUser>> => {
    let query = 
        `SELECT            
            username,
            email,
            uuid
        FROM users
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

export const getOneUser = (uuid: string): Promise<QueryResult<IdataUser>> => {
    const query =
        `select
            username,
            email,
            uuid
        FROM users
        where uuid=$1`;
    const values = [uuid];
    return db.query(query, values);
};

export const createUser = (body: IuserBody): Promise<QueryResult<IdataUser>> => {
    const query = 
        `insert into users (username, email, password)
        values ($1, $2, $3)
        returning
            username,
            email,
            created_at,
            uuid`;
    const { username, email, password } = body;
    const values = [username, email, password];
    return db.query(query, values);
};

export const updateUser = (
    uuid: string,
    body: Partial<IuserBody>
): Promise<QueryResult<IdataUser>> => {
    let query = `UPDATE users SET `;
    const values: any[] = [];
    let index = 1;

    if (body.username) {
        query += `username = $${index}, `;
        values.push(body.username);
        index++;
    }
    if (body.email) {
        query += `email = $${index}, `;
        values.push(body.email);
        index++;
    }
    if (body.password) {
        query += `password = $${index}, `;
        values.push(body.password);
        index++;
    }

    query += `updated_at = NOW()
    WHERE uuid = $${index}
    RETURNING
        username,
        email,
        password,
        uuid`;
    values.push(uuid);

    return db.query(query, values);
};

export const updateUserSoftDelete = (uuid: string): Promise<QueryResult<IdataUser>> => {
    const query =
        `update users
        set
            is_deleted = true            
        where uuid = $1
        returning username as "user name", is_deleted`;    
    return db.query(query, [uuid]);
};

export const registerUser = (
    body: IuserRegisterBody,
    hashedPassword: string    
  ): Promise<QueryResult<IdataUser>> => {
    const query =
        `insert into users (username, email, password)
        values ($1, $2, $3)
        returning
            username,
            email,
            created_at,
            uuid`;
    const {username, email} = body;
    const values = [username, email, hashedPassword];
    return db.query(query, values);
};

export const getPasswordUser = (uuid: string): Promise<QueryResult<{username: string, password: string}>> => {
    const query = `SELECT username, password from users where uuid = $1`;
    const values = [uuid];
    return db.query(query, values);
};