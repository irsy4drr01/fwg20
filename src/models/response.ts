import { IdataProduct } from "./product";
import { IdataUser } from "./users";

interface IPaginationMeta {
    totalData?: number;
    totalPage?: number;
    page: number;
    prevLink: string | null;
    nextLink: string | null;
}

interface IBasicResponse {
    msg: string;
    data?: any[];
    err?: string;
    meta?: IPaginationMeta;
}

export interface IuserResponse extends IBasicResponse {
  data?: IdataUser[];
}

export interface IproductResponse extends IBasicResponse {
    data?: IdataProduct[];
  }

export interface IAuthResponse extends IBasicResponse {
    data?: { token: string }[];
  }