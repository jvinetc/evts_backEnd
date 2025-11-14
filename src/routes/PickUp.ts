import { Router } from "express";
import { chartsPickUpDay, chartsPickUpDriver, countPickUps, createPickUp, getPickUp } from "../controller/PickUp";

const router= Router();

router.get('/pickup-chart', chartsPickUpDriver );
router.get('/pickup-day-chart', chartsPickUpDay );
router.get('/count', countPickUps);
router.get('/', getPickUp );
router.post('/', createPickUp);

export default router;