import { ParamsDictionary } from "express-serve-static-core";
import { IproductBody, IproductParams, IproductQuery } from "./product";
import { IuserParams } from "./users";

export type AppParams = ParamsDictionary  | IuserParams | IproductBody | IproductParams;
export type QueryParams = IproductQuery;