import { Request, Response } from "express";

import { getAllOrders, getOneOrder, createOrder, updateOrder, softDeleteOrder } from "../repositories/orders";
import { IorderBody, IorderParams } from "../models/orders";

export const getOrders = async (req: Request, res: Response) => {
    try {
        const result = await getAllOrders();

        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Orders Not Found",
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

export const getOrderDetail = async (req: Request<IorderParams>, res: Response) => {
    const { order_number } = req.params;    
    try {
        const result = await getOneOrder(order_number);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Order Not Found",
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

export const createNewOrder = async (req: Request<{}, {}, IorderBody>, res: Response) => {
    try {
        const result = await createOrder(req.body);
        return res.status(201).json({
            msg: "Success",
            data: result.rows,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};

export const updateOrderHandler = async (req: Request<{order_number: string}, {}, Partial<IorderBody>>, res: Response) => {
    const { order_number } = req.params;
    try {
        const result = await updateOrder(order_number, req.body);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Order Not Found",
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

export const deleteOrderHandler = async (req: Request<{order_number: string}>, res: Response) => {
    const { order_number } = req.params;
    try {
        const result = await softDeleteOrder(order_number);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Order Not Found",
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
