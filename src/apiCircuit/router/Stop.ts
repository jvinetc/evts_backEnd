import { Router } from "express";
import { listStops, syncApps } from "../controller/StopApi";
const router = Router();

router.get('/sync', syncApps);
router.get('/', listStops);


export default router;