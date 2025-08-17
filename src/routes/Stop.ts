import { Router } from "express";
import { createStopMiddleware, fromExcel, toExcelBuffer, updateStopMiddleware } from "../middleware/Stop";
import { addFromExcel, createFromExcel, createStop, disableStop, generateTemplate, getPayDetail, getPaysBySell, listStopByUSer, listStops, processPay, updateStop } from "../controller/Stop";
import multer from "multer";

const uploadExcel = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/uploadExcel/:sellId', uploadExcel.single('file'), toExcelBuffer, createFromExcel);
router.post('/byExcel', fromExcel, addFromExcel);
router.post('/pay', processPay);
router.post('/', createStopMiddleware, createStop);
router.get('/pays/detail/:buyOrder', getPayDetail);
router.get('/pays/:sellId', getPaysBySell);
router.get('/downloadTemplate', generateTemplate);
router.get('/:sellId', listStopByUSer);
router.get('/', listStops);
router.put('/disable', disableStop);
router.put('/', updateStopMiddleware, updateStop);

export default router;