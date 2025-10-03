import { Router } from "express";
import { loginMiddleware, registerMiddleware, updateUserMiddleware } from "../middleware/User";
import { createUSer, disableUser, listUsers, login, recoveryPass, registerUser, updateUser, verify } from "../controller/User";
import { authConfirm } from "../middleware/Auth";

const router = Router();

router.post('/register', registerMiddleware, registerUser);
router.post('/login', loginMiddleware, login)
router.post('/', createUSer);
router.get('/recovery/:email', recoveryPass);
router.get('/verify/:token', verify)
router.get('/', listUsers);
router.put('/disable', authConfirm, disableUser);
router.put('/', updateUserMiddleware, updateUser);

export default router;