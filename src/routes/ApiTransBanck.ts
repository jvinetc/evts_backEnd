import { Router } from "express";
import { createTransaction, getDataPayment, verifyPay } from "../controller/ApiTransbanck";
import { authConfirm } from "../middleware/Auth";

const router = Router();

router.get('/verify', verifyPay);
router.post('/',createTransaction);
router.get('/:authorization_code', authConfirm, getDataPayment);

export default router;