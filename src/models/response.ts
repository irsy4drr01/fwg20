import { IdataUser } from "./users";

interface IBasicResponse {
    msg: string;
    data?: any[];
    err?: string;
}

export interface IuserResponse extends IBasicResponse {
  data?: IdataUser[];
}

export interface IAuthResponse extends IBasicResponse {
    data?: { token: string }[];
  }