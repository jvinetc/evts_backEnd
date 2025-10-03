import { Router } from "express";
import { listComunas, setComuna } from "../controller/Comuna";
import { authConfirm } from "../middleware/Auth";

const router = Router();

router.get('/'/* , authConfirm*/ ,listComunas);
router.post('/'/* , authConfirm */, setComuna);

export default router;