import { Router } from "express";
import { createDriverMiddleware, updateDriverMiddleware } from "../middleware/Driver";
import { createDriver, disableDriver, getDrivers, updateDriver } from "../controller/Driver";

const router = Router();

router.post('/', createDriverMiddleware, createDriver);
router.get('/', getDrivers);
router.put('/disable', disableDriver);
router.put('/', updateDriverMiddleware, updateDriver);

export default router;