import { NextFunction, Request, Response } from "express-serve-static-core";
import jwt, { SignOptions } from "jsonwebtoken";

import { AppParams } from "../models/params";
import { IAuthResponse } from "../models/response";
import { IPayload } from "../models/payload";



export const jwtOptions: SignOptions = {
    expiresIn: "5m", // token akan hangus dalam 5 menit
    issuer: process.env.JWT_SECRET,
};

export const authorization = (
    req: Request<AppParams>,
    res: Response<IAuthResponse>,
    next: NextFunction) => {
    // cel jwt
    // tdk valid => tolak
    const bearerToken = req.header("Authorization");
    // hadle jika tanpa token
    if (!bearerToken) {
        return res.status(403).json ({
            msg: "Forbidden",
            err: "Access DENIED!",
        });
    }
    const token = bearerToken.split(" ")[1];

    // verifikasi token
    jwt.verify(token, process.env.JWT_SECRET as string, jwtOptions, (err, payload) => {
        // tidak valid => tolak
        if (err) {
            return res.status(403).json({
                msg: err.message,
                err: err.name,
            })
        }
        // valid => lanjut
        req.userPayload = payload as IPayload;
        next();
    });    
};