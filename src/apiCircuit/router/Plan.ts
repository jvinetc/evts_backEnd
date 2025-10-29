import { Router } from "express";
import { listPlans, findPlan } from "../controller/Plan";
import { createCircuitPlan, optmizePlan, sendPlan } from "../controller/StopApi";
const router = Router();

router.get('/create/:planId', createCircuitPlan);
router.get('/optimize/:planId', optmizePlan);
router.get('/send/:planId', sendPlan);
router.get('/', listPlans);
router.post('/find', findPlan);


export default router;