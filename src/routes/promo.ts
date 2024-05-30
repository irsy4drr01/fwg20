import { Router } from "express";
import { getPromos, getDetailPromo, createNewPromo, updatePromoHandler, deletePromoHandler } from "../handlers/promo";

const promoRouter = Router();

// GET all promos
promoRouter.get("/", getPromos);

// GET detail promo
promoRouter.get("/:promo_code", getDetailPromo);

// POST create new promo
promoRouter.post("/", createNewPromo);

// PATCH update promo
promoRouter.patch("/:uuid", updatePromoHandler);

// DELETE delete promo
promoRouter.delete("/:promo_code", deletePromoHandler);

export default promoRouter;
