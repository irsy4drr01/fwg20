import { ParamsDictionary } from "express-serve-static-core";
import { IproductBody } from "./product";
import { IuserParams } from "./users";

export type AppParams = ParamsDictionary  | IuserParams | IproductBody;