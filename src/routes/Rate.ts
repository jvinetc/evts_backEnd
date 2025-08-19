import { Router } from "express";
import { createRateMiddleware, updateRateMiddleware } from "../middleware/Rate";
import { createRate, disableRate, getRates, updateRate } from "../controller/Rate";
import { authConfirm } from "../middleware/Auth";

const router = Router();

router.post('/', authConfirm, createRateMiddleware, createRate);
router.get('/', authConfirm, getRates);
router.put('/disable', authConfirm, disableRate);
router.put('/', authConfirm, updateRateMiddleware, updateRate);

export default router;