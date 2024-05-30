import { Request, Response } from "express-serve-static-core";

import { getAllPromos, getOnePromo, createPromo, updatePromo, deletePromo } from "../repositories/promo";
import { IpromoBody, IpromoParams, IpromoQuery } from "../models/promo";

export const getPromos = async (req: Request<{}, {}, {}, IpromoQuery>, res: Response) => {
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
        
        const result = await getAllPromos(limitNumber, offset);

        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Promo Not Found",
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

export const getDetailPromo = async (req: Request<IpromoParams>, res: Response) => {
    const { promo_code } = req.params;
    try {
        const result = await getOnePromo(promo_code);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Promo Not Found",
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

export const createNewPromo = async (req: Request<{}, {}, IpromoBody>, res: Response) => {
    try {
        const result = await createPromo(req.body);
        return res.status(201).json({
            msg: "Success",
            data: result.rows,
        })
    } catch (err) {
        if ((err as Error).message.includes('duplicate key value violates unique constraint "promo_code_unique"')) {
            return res.status(400).json({
                msg: "Error",
                err: "Promo code already exists",
            });
        }
        console.error(err);
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};

export const updatePromoHandler = async (req: Request<{uuid: string}, {}, Partial<IpromoBody>>, res: Response) => {
    const { uuid } = req.params;
    try {
        const result = await updatePromo(uuid, req.body);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Promo Not Found",
                data: [],
            });
        }
        return res.status(200).json({
            msg: "Success",
            data: result.rows,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};

export const deletePromoHandler = async (req: Request<{promo_code: string}>, res: Response) => {
    const { promo_code } = req.params;
    try {
        const result = await deletePromo(promo_code);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Promo Not Found",
                data: [],
            });
        }
        return res.status(200).json({
            msg: "Deleted Successfully",
            data: result.rows,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};
