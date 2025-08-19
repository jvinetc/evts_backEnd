import { Router } from "express";
import { createDriverMiddleware, updateDriverMiddleware } from "../middleware/Driver";
import { createDriver, disableDriver, getDrivers, updateDriver } from "../controller/Driver";
import { authConfirm } from "../middleware/Auth";

const router = Router();

router.post('/', createDriverMiddleware, createDriver);
router.get('/', authConfirm, getDrivers);
router.put('/disable', authConfirm, disableDriver);
router.put('/', authConfirm, updateDriverMiddleware, updateDriver);

export default router;