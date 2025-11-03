import { Router } from "express";
import { chartsFailedDriver, getFailed } from "../controller/Failed";

const router= Router();

router.get('/failed-chart', chartsFailedDriver );
router.get('/', getFailed );
/* router.post('/', createPickUp); */

export default router;