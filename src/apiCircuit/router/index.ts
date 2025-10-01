import { Router } from 'express';
import drivesrRouter from './Driver';
import stopsRouter from './Stop';
import plansRouter from './Plan';
import webhookRouter from './webhook';

const router = Router();

router.use('/drivers', drivesrRouter);
router.use('/stops', stopsRouter);
router.use('/plans', plansRouter);
router.use('/webhook', webhookRouter)

export default router;