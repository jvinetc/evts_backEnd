import { Router } from "express";
import { syncDrivers } from "../controller/StopApi";
const router = Router();

router.get('/sync', syncDrivers);

export default router;