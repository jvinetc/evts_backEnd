import { Router } from "express";
import { autocomplete, detailAddres } from "../controller/AddresApi";
import { authConfirm } from "../middleware/Auth";

const router = Router();

router.get('/detail/:placeId',authConfirm, detailAddres);
router.post('/:textInput',authConfirm , autocomplete);

export default router;