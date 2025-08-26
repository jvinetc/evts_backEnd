import { Router } from "express";
import { createRateMiddleware, updateRateMiddleware } from "../middleware/Rate";
import { createRate, disableRate, getRateById, getRates, getRatesByAdmin, updateRate } from "../controller/Rate";
import { authConfirm } from "../middleware/Auth";

const router = Router();

router.post('/', authConfirm, createRateMiddleware, createRate);
router.get('/byAdmin', getRatesByAdmin);
router.get('/:id', authConfirm, getRateById);
router.get('/', authConfirm, getRates);
router.put('/disable/:id', authConfirm, disableRate);
router.put('/', authConfirm, updateRateMiddleware, updateRate);

export default router;