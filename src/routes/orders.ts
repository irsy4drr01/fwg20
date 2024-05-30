import { Router } from "express";
import { getOrders, getOrderDetail, createNewOrder, updateOrderHandler, deleteOrderHandler } from "../handlers/orders";

const ordersRouter = Router();

// GET all orders
ordersRouter.get("/", getOrders);

// GET order detail
ordersRouter.get("/:order_number", getOrderDetail);

// POST create new order
ordersRouter.post("/", createNewOrder);

// PATCH update order
ordersRouter.patch("/:order_number", updateOrderHandler);

// DELETE soft delete order
ordersRouter.delete("/:order_number", deleteOrderHandler);

export default ordersRouter;
