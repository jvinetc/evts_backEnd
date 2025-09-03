import { Router } from "express";
import { getPays, listPaysCharts, listSellsPaysCharts } from "../controller/Payments";

const router= Router();

router.get('/sell-chart', listSellsPaysCharts );
router.get('/pays-chart', listPaysCharts );
router.get('/', getPays);

export default router;