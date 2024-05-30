import { NextFunction, Request, Response } from "express-serve-static-core";
import { SignOptions } from "jsonwebtoken";

// export const jwtOptions: SignOptions = {
//     expiresIn: "5m", // token akan hangus dalam 5 menit
//     issuer: process.env.JWT_ISSUER as string,
// };

export const authorization = (req: Request, res: Response, next: NextFunction) => {
    // cel jwt
    // tdk valid => tolak
    // valid => lanjut
    
};