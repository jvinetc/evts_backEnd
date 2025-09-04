import { Router } from "express";
import { createSellMiddleware, updateSellMiddleware } from "../middleware/Sell";
import { createSell, disableSell, getSell, getSellById, getSellByUser, updateSell, createSellAdmin } from "../controller/Sell";
import { authConfirm } from "../middleware/Auth";

const router = Router();


router.get('/:idUser', authConfirm, getSellByUser);
router.get('/admin/:sellId', authConfirm,getSellById);
router.post('/', createSellMiddleware, createSell);
router.post('/createAdmin', authConfirm ,createSellAdmin);
router.get('/', authConfirm, getSell);
router.put('/disable', authConfirm, disableSell);
router.put('/', updateSellMiddleware, updateSell);

export default router;