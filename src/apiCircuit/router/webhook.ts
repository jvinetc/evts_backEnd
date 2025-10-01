import { Router } from "express";
import { webHookCircuit } from "../controller"

const router = Router();

router.post('/', webHookCircuit);

export default router;