import { Router } from "express";
import { autocomplete } from "../controller/AddresApi";

const router = Router();

router.post('/:textImput', autocomplete);

export default router;