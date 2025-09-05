import { Router } from "express";
import { chartsPickUpDriver, createPickUp, getPickUp } from "../controller/PickUp";

const router= Router();

router.get('/pickup-chart', chartsPickUpDriver );
router.get('/', getPickUp );
router.post('/', createPickUp);

export default router;