import { Router } from "express";
import { createDriverMiddleware, updateDriverMiddleware } from "../middleware/Driver";
import { createDriver, disableDriver, getDriverById, getDrivers, updateDriver } from "../controller/Driver";
import { authConfirm } from "../middleware/Auth";
import multer from "multer";
import path from 'path';
import { storage } from '../util/cloudinary';

export const upload = multer({ storage });

const router = Router();

// Configuración del almacenamiento
/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // carpeta donde se guardan los archivos
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // conserva la extensión original
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// Filtro para aceptar solo PDFs
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'));
  }
};

// Middleware de multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // opcional: máximo 5MB por archivo
  }
}); */
router.post('/', upload.array('file'), createDriverMiddleware, createDriver);
router.get('/:id', getDriverById);
router.get('/'/* , authConfirm */, getDrivers);
router.put('/disable', authConfirm, disableDriver);
router.put('/:id', upload.fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'file3', maxCount: 1 }
]), authConfirm, updateDriverMiddleware, updateDriver);

export default router;