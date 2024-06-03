export interface IuserParams {    
    uuid: string;
}

export interface IuserQuery {
    username?: string;
    limit?: number;
    page?: number;
}

export interface IuserBody {
    username: string;
    email: string;
    password?: string;
}

export interface IdataUser extends IuserBody {    
    uuid: string;
    created_at: string;
    updated_at: string | null;
    id?: number;
}

export interface IuserRegisterBody extends IuserBody {
    password?: string;
    uuid?: string;
}

export interface IuserLogin {
    email: string;
    password: string;
}