import { Router } from "express";
import { listRoles, setRole } from "../controller/Role";
import { authConfirm } from "../middleware/Auth";

const router = Router();

router.post('/', authConfirm, setRole);
router.get('/', authConfirm, listRoles);

export default router;