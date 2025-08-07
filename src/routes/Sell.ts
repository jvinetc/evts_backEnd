import { Router } from "express";
import { createSellMiddleware, updateSellMiddleware } from "../middleware/Sell";
import { createSell, disableSell, getSell, getSellByUser, updateSell } from "../controller/Sell";

const router = Router();


router.get('/:idUser', getSellByUser);
router.post('/', createSellMiddleware, createSell);
router.get('/', getSell);
router.put('/disable', disableSell);
router.put('/', updateSellMiddleware, updateSell);

export default router;