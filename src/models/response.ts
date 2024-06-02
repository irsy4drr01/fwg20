import { IdataProduct } from "./product";
import { IdataUser } from "./users";

interface IBasicResponse {
    msg: string;
    data?: any[];
    err?: string;
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