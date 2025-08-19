import { Router } from "express";
import { createSellMiddleware, updateSellMiddleware } from "../middleware/Sell";
import { createSell, disableSell, getSell, getSellByUser, updateSell } from "../controller/Sell";
import { authConfirm } from "../middleware/Auth";

const router = Router();


router.get('/:idUser', authConfirm, getSellByUser);
router.post('/', createSellMiddleware, createSell);
router.get('/', authConfirm, getSell);
router.put('/disable', authConfirm, disableSell);
router.put('/', updateSellMiddleware, updateSell);

export default router;