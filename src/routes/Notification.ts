import { Router } from "express";
import { getNotificationAdmin, getNotificationClient, getNotRead, getNotReadC, markToRead, saveExpoToken } from "../controller/Notification";
import { authConfirm } from "../middleware/Auth";
const router = Router();

router.get('/byClient', getNotificationClient)
router.get('/byAdmin', getNotificationAdmin);
router.get('/notRead/:sellId', getNotReadC);
router.get('/notRead', getNotRead);
router.put('/read/:id', authConfirm, markToRead);
router.post('/push-token', saveExpoToken);

export default router;
