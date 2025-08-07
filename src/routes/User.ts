import { Router } from "express";
import { loginMiddleware, registerMiddleware, updateUserMiddleware } from "../middleware/User";
import { createUSer, disableUser, listUsers, login, registerUser, updateUser, verify } from "../controller/User";

const router = Router();

router.post('/register', registerMiddleware, registerUser);
router.post('/login', loginMiddleware, login)
router.post('/', createUSer);
router.get('/verify/:token', verify)
router.get('/', listUsers);
router.put('/disable', disableUser);
router.put('/', updateUserMiddleware, updateUser);

export default router;