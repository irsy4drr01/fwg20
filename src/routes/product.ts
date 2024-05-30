import { Request, Response, Router } from "express";

import { getProduct, getDetailProduct, createNewProduct, getCategoriesHandler, updateProductHandler, deleteProductHandler } from "../handlers/product";

const productRouter = Router();

// CRUD

// SELECT
// /product/
productRouter.get("/", getProduct);
// Query pencarian
// memanfaatkan route query u/ data dinamis di akhir url
// ?key1=value1&key2=value2&.......keyn=valuen (terletak di akhir url)
// /product?product_name=a&category=Coffee


// route category
productRouter.get("/categories", getCategoriesHandler);


// memanfaatkan route parasm untuk data dinamis di url
// /product/:product_name
productRouter.get("/:uuid", getDetailProduct);


// INSERT
// Menambah product baru
productRouter.post("/", createNewProduct);

// UPDATE
productRouter.patch("/:uuid", updateProductHandler);

// DELETE SOFT
productRouter.delete("/:uuid", deleteProductHandler);


export default productRouter;