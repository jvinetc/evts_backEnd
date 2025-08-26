import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'app-files', // puedes separar por tipo: 'conductores', 'tiendas'
    allowed_formats: ['jpg', 'png', 'pdf'],
    transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
  },
});

export { cloudinary };