import { Router } from "express";

import productRouter from "./product";
import usersRouter from "./users";
import promoRouter from "./promo";
import ordersRouter from "./orders";

const mainRouter = Router();

mainRouter.use("/product", productRouter);
mainRouter.use("/users", usersRouter);
mainRouter.use("/promo", promoRouter);
mainRouter.use("/orders", ordersRouter);

export default mainRouter;