import { Router } from "express";
import { autocomplete, detailAddres } from "../controller/AddresApi";

const router = Router();

router.get('/detail/:placeId', detailAddres);
router.post('/:textInput', autocomplete);

export default router;