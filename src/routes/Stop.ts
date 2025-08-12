import { Router } from "express";
import { createStopMiddleware, fromExcel, updateStopMiddleware } from "../middleware/Stop";
import { addFromExcel, createStop, disableStop, listStopByUSer, listStops, processPay, updateStop } from "../controller/Stop";

const router = Router();

router.post('/byExcel', fromExcel, addFromExcel);
router.post('/pay', processPay);
router.post('/', createStopMiddleware, createStop);
router.get('/:sellId', listStopByUSer);
router.get('/', listStops);
router.put('/disable', disableStop);
router.put('/', updateStopMiddleware, updateStop);

export default router;