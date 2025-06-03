import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { RequestHandler } from 'express';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder = 'autoFit';
        if (file.fieldname === 'photo') folder += '/profiles';
        if (file.fieldname === 'shopImage') folder += '/shops';
        if (file.fieldname === 'qualification') folder += '/docs';

        const ext = file.originalname.split('.').pop()?.toLowerCase();
        const isPDF = ext === 'pdf';

        return {
            folder,
            format: ext,
            resource_type: isPDF ? 'raw' : 'image',
            public_id: file.originalname.split('.')[0], 
        };
    }
});

const upload = multer({ storage });

const fileUploadMiddleware: RequestHandler = upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'shopImage', maxCount: 1 },
    { name: 'qualification', maxCount: 1 },
]);

export default fileUploadMiddleware;