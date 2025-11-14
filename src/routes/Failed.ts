import { Router } from "express";
import { chartsFailedDriver, countFailed, getFailed } from "../controller/Failed";

const router= Router();

router.get('/failed-chart', chartsFailedDriver );
router.get('/count', countFailed)
router.get('/', getFailed );
/* router.post('/', createPickUp); */

export default router;