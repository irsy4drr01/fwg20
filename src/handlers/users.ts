import { Request, Response } from "express-serve-static-core";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getAllUsers, getOneUser, createUser, updateUser, updateUserSoftDelete, registerUser, getPasswordUser } from "../repositories/users";
import { IuserBody, IuserLoginBody, IuserParams, IuserQuery, IuserRegisterBody } from "../models/users";
import { IAuthResponse, IuserResponse } from "../models/response";
import { IPayload } from "../models/payload";
import { SignOptions } from "jsonwebtoken";

export const getUsers = async (req: Request<{}, {}, {}, IuserQuery>, res: Response<IuserResponse>) => {
    try {
        const { page, limit } = req.query;
        
        const pageNumber = page || 1; // Halaman default adalah 1
        const limitNumber = limit || 5; // Jumlah item per halaman default adalah 5
        const offset = (pageNumber - 1) * limitNumber; // Menghitung offset berdasarkan halaman dan limit

        if (page && (pageNumber <= 0 || limitNumber <= 0)) {
            return res.status(400).json({
                msg: "Invalid page or limit value",
                data: [],
            });
        }
        
        const result = await getAllUsers(limitNumber, offset);

        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "User Not Found",
                data: [],
            });
        }        
        return res.status(200).json({
            msg: "Success",
            data: result.rows,
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};

export const getDetailUser = async (req: Request<IuserParams>, res: Response<IuserResponse>) => {
    const { uuid } = req.params;
    try {
        const result = await getOneUser(uuid);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "User Not Found",
                data: [],
            });
        }
        return res.status(200).json({
            msg: "Success",
            data: result.rows,
        });
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};

export const createNewUser = async (req: Request<{}, {}, IuserBody>, res: Response<IuserResponse>) => {
    try {
        const result = await createUser(req.body);
        return res.status(201).json({
            msg: "Success",
            data: result.rows,
        })
    } catch (err) {
        if ((err as Error).message.includes('duplicate key value violates unique constraint "username_unique"')) {
            return res.status(400).json({
                msg: "Error",
                err: "Username already exists",
            });
        }
        console.error(err);
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};

export const updateUserHandler = async (req: Request<{uuid: string}, {}, Partial<IuserBody>>, res: Response<IuserResponse>) => {
    const { uuid } = req.params;
    try {
        const result = await updateUser(uuid, req.body);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "User Not Found",
                data: [],
            });
        }
        return res.status(200).json({
            msg: "Success",
            data: result.rows,
        });
    } catch (err) {
        if ((err as Error).message.includes('invalid input syntax for type uuid: ":uuid"')) {
            return res.status(400).json({
                msg: "Error",
                err: "Blank UUID, please complete it",
            });
        }
        const uuidError = /invalid input syntax for type uuid: "(.*?)"/;
        const match = uuidError.exec((err as Error).message);

        if (match) {
            const invalidUuid = match[1];
            return res.status(400).json({
                msg: "Error",
                err: `Invalid UUID: ${invalidUuid}`,
            });
        }

        console.log(err);
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};

export const deleteUserHandler = async (req: Request<{uuid: string}, {}, Partial<IuserBody>>, res: Response<IuserResponse>) => {
    const { uuid } = req.params;
    try {
        const result = await updateUserSoftDelete(uuid);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "User Not Found",
                data: [],
            });
        }
        return res.status(200).json({
            msg: "Deleted Successfully",
            data: result.rows,
        });
    } catch (err) {
        if ((err as Error).message.includes('invalid input syntax for type uuid: ":uuid"')) {
            return res.status(400).json({
                msg: "Error",
                err: "Blank UUID, please complete it",
            });
        }
        const uuidError = /invalid input syntax for type uuid: "(.*?)"/;
        const match = uuidError.exec((err as Error).message);

        if (match) {
            const invalidUuid = match[1];
            return res.status(400).json({
                msg: "Error",
                err: `Invalid UUID: ${invalidUuid}`,
            });
        }

        console.error(err);
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};

export const registerNewUser = async (req: Request<{}, {}, IuserRegisterBody>, res: Response<IuserResponse>) => {
    const { password } = req.body;    
    try {
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(password as string, salt);
        const result = await registerUser(req.body, hashed);
        return res.status(201).json({
            msg: "Success",
            data: result.rows,
        });
    } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        return res.status(500).json({
          msg: "Error",
          err: "Internal Server Error",
        });
    }
};

export const loginUser = async (
    req: Request<{}, {}, IuserLoginBody>,
    res: Response<IAuthResponse>) => {
    
    const {uuid, password} = req.body;
    try {
        const result = await getPasswordUser(uuid);
        if (!result.rows.length) throw new Error("User tidak ditemukan");
        
        const user = result.rows[0];
        const { password: hash, username } = user;

        const isPasswordValid = await bcrypt.compare(password, hash);
        if (!isPasswordValid) throw new Error("Login gagal, Password Salah");
        const payload: IPayload = {
            uuid, // uuid: uuid
          };
        
        const jwtOptions: SignOptions = {
            expiresIn: "5m", // token akan hangus dalam 5 menit
            issuer: process.env.JWT_SECRET,
        };
        const token = jwt.sign(payload, <string>process.env.JWT_SECRET, jwtOptions);
        return res.status(200).json({
            msg: `Selamat datang, ${username}!`,
            data: [{ token }],
        })
    } catch (error) {
        if (error instanceof Error) {
            if (/(invalid(.)+uuid(.)+)/g.test(error.message)) {
                return res.status(401).json({
                  msg: "Error",
                  err: "Siswa tidak ditemukan",
                });
            }
        return res.status(401).json({
                msg: "Error",
                err: error.message,
            })
        }
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        })
    }
};