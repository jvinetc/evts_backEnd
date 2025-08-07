import { Router } from "express";
import { listComunas, setComuna } from "../controller/Comuna";

const router = Router();

router.get('/', listComunas);
router.post('/', setComuna);

export default router;