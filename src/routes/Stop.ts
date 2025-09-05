import { Router } from "express";
import { createStopMiddleware, fromExcel, toExcelBuffer, updateStopMiddleware } from "../middleware/Stop";
import { addFromExcel, asignDriversToStops, createFromExcel, createStop, disableStop, generateTemplate, getPayDetail, getPaysBySell, getStopById, listStopByAdmin, listStopByUSer, listStops, listStopsCharts, listStopsComunas, listStopsDelivered, listStopsPending, processPay, updateStop } from "../controller/Stop";
import multer from "multer";
import { authConfirm } from "../middleware/Auth";

const uploadExcel = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/uploadExcel/:sellId', uploadExcel.single('file'), toExcelBuffer, createFromExcel);
router.post('/byExcel', fromExcel, addFromExcel);
router.post('/pay', authConfirm, processPay);
router.post('/', createStopMiddleware, createStop);
router.get('/pays/detail/:buyOrder', authConfirm, getPayDetail);
router.get('/pays/:sellId', authConfirm, getPaysBySell);
router.get('/downloadTemplate', authConfirm, generateTemplate);
router.get('/chart/comuna', listStopsComunas);
router.post('/asignDriver', authConfirm, asignDriversToStops);
router.get('/chart', listStopsCharts);
router.get('/stop/:id', getStopById);
router.get('/byAdmin', listStopByAdmin);
router.get('/pending'/* , authConfirm */, listStopsPending);
router.get('/delivered'/* , authConfirm */, listStopsDelivered);
router.get('/:sellId', authConfirm, listStopByUSer);
router.get('/'/* , authConfirm */, listStops);
router.put('/disable', authConfirm, disableStop);
router.put('/', authConfirm, updateStop);

export default router;