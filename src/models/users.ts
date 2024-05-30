export interface IdataUser extends IuserBody {
    id: number;
    uuid: string;
    created_at: string;
    updated_at: string | null;
}

export interface IuserParams {
    uuid: string;
}

export interface IuserQuery {
    limit?: number;
    page?: number;
}

export interface IuserBody {
    username: string;
    email: string;
    password?: string;
}

export interface IuserBody2 {
    username: string;
    email: string;
}

export interface IuserRegisterBody extends IuserBody2 {
    password?: string;
}

export interface IuserLoginBody {
    uuid: string;
    password: string;
}