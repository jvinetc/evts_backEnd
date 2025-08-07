import { Router } from "express";
import { createImageUser } from "../controller/Images";
import multer from "multer";

const router = Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var upload = multer({ storage: storage })
//router.get('/user', listComunas);
router.post('/user/:id',upload.single('file'), createImageUser);

export default router;