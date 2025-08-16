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
var upload = multer({ storage, 
    fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  },})
//router.get('/user', listComunas);
router.post('/user/:id', upload.single('file'), createImageUser);

export default router;