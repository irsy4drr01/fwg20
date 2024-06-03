import { Request, Response } from "express-serve-static-core";

import { getAllProduct, getOneProduct, createProduct, getCategories, updateProduct, updateProductSoftDelete, getTotalProduct } from "../repositories/product";
import { IproductBody, IproductParams, IproductQuery, Sort} from "../models/product";
import { IproductResponse,  } from "../models/response";
import getLink from "../helpers/getLink";

export const getProduct = async (req: Request<{}, {}, {}, IproductQuery>, res: Response<IproductResponse>) => {
    try {
        const { product_name, category, min_price, max_price, sort, page, limit } = req.query;

        const pageNumber = parseInt(page as string) || 1; // Halaman default adalah 1
        const limitNumber = parseInt(limit as string) || 5; // Jumlah item per halaman default adalah 5
        const offset = (pageNumber - 1) * limitNumber; // Menghitung offset berdasarkan halaman dan limit

        if (page && (pageNumber <= 0 || limitNumber <= 0)) {
            return res.status(400).json({
                msg: "Invalid page or limit value",
                data: [],
            });
        }

        const validCategory: string[] = ["Coffee", "Non-Coffee", "Food", "Snack"];
        if (category && !validCategory.includes(category)) {
            return res.status(400).json({
                msg: `Invalid category parameter. Must be one of: ${validCategory.join(", ")}`,
                data: [],
            });
        }

        const validSorts: string[] = ["a-z", "z-a", "cheapest", "priciest", "oldest", "newest"];
        if (sort && !validSorts.includes(sort)) {
            return res.status(400).json({
                msg: `Invalid sort parameter. Must be one of: ${validSorts.join(", ")}`,
                data: [],
            });
        }

        const result = await getAllProduct(product_name, category, min_price, max_price, sort as Sort, limitNumber, offset);

        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Product Not Found",
                data: [],
            });
        }

        {
            const dataProduct = await getTotalProduct(req.query);
            const page = parseInt((req.query.page as string) || "1");
            const totalData = parseInt(dataProduct.rows[0].total_product);
            const totalPage = Math.ceil(totalData/parseInt(req.query.limit as string));
            return res.status(200).json({
                msg: "Success",
                data: result.rows,
                meta: {
                    totalData,
                    totalPage,
                    page,
                    prevLink: page > 1 ? getLink(req, "previous"): null,
                    nextLink: page != totalPage ? getLink(req, "next"): null,
                },
            });
        }
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

export const getDetailProduct = async (req: Request<IproductParams>, res: Response<IproductResponse>) => {
    const {uuid} = req.params;
    try {
        const result = await getOneProduct(uuid);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Product Not Found",
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

export const createNewProduct = async (req: Request<{}, {}, IproductBody>, res: Response<IproductResponse>) => {
    try {
        const result = await createProduct(req.body);
        return res.status(201).json({
            msg: "Success",
            data: result.rows,
        })
    } catch (err) {
        if ((err as Error).message.includes('duplicate key value violates unique constraint "product_name_unique"')) {
            return res.status(400).json({
                msg: "Error",
                err: "Product name already exists",
            });
        }
        console.error(err);
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};

export const getCategoriesHandler = async (req: Request, res: Response) => {
    try {        
        const result = await getCategories();
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

export const updateProductHandler = async (
    req: Request<{uuid: string}, {}, Partial<IproductBody>>,
    res: Response<IproductResponse>) => {
    const { uuid } = req.params;
    try {
        const result = await updateProduct(uuid, req.body);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Product Not Found",
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
            const invalidUuid = match[1]; // Mengambil nilai UUID yang tidak valid
            return res.status(400).json({
                msg: "Error",
                err: `Invalid UUID: ${invalidUuid}`,
            });
        }
        if ((err as Error).message.includes('duplicate key value violates unique constraint "product_name_unique"')) {
            return res.status(400).json({
                msg: "Error",
                err: "Product name already exists",
            });
        }        

        console.error(err);
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
};

export const deleteProductHandler = async (
    req: Request<{uuid: string}, {}, Partial<IproductBody>>,
    res: Response<IproductResponse>) => {
    const { uuid } = req.params;
    try {
        const result = await updateProductSoftDelete(uuid);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: "Product Not Found",
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
            const invalidUuid = match[1]; // Mengambil nilai UUID yang tidak valid
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




