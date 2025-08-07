import { Router } from "express";
import { createRateMiddleware, updateRateMiddleware } from "../middleware/Rate";
import { createRate, disableRate, getRates, updateRate } from "../controller/Rate";

const router = Router();

router.post('/', createRateMiddleware, createRate);
router.get('/', getRates);
router.put('/disable', disableRate);
router.put('/', updateRateMiddleware, updateRate);

export default router;