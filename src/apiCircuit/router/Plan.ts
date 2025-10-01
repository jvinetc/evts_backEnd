import { Router } from "express";
import { listPlans, findPlan } from "../controller/Plan";
import { createCircuitPlan, sendPlan } from "../controller/StopApi";
import { optimizePlan } from "../api/Plan";
const router = Router();

router.get('/create/:planId', createCircuitPlan);
router.get('/optimize/:planId', optimizePlan);
router.get('/send/:planId', sendPlan);
router.get('/', listPlans);
router.post('/find', findPlan);


export default router;