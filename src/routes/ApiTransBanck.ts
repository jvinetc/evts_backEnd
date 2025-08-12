import { Router } from "express";
import { createTransaction, getDataPayment, verifyPay } from "../controller/ApiTransbanck";

const router = Router();

router.get('/verify', verifyPay);
router.post('/', createTransaction);
router.get('/:authorization_code', getDataPayment);

export default router;