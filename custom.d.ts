import * as express from "express";

import { IPayload } from "./src/models/payload";

declare global {
    namespace Express {
        export interface Request {
            userPayload?: IPayload | string;
        }
    }
}