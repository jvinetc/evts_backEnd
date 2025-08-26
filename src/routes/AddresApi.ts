import { Router } from "express";
import { autocomplete, detailAddres } from "../controller/AddresApi";
import { authConfirm } from "../middleware/Auth";

const router = Router();

router.get('/detail/:placeId', detailAddres);
router.post('/:textInput', autocomplete);

export default router;