import { Router } from "express";
import { listRoles, setRole } from "../controller/Role";

const router = Router();

router.post('/', setRole);
router.get('/', listRoles);

export default router;