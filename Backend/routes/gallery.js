import express from 'express';
import {
  getAllImages,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages
} from '../controllers/galleryController.js';
import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const router = express.Router();

// Routes
router.get('/', getAllImages);
router.post('/', upload.single('image'), uploadImage);
router.post('/bulk-upload', upload.array('images', 20), uploadMultipleImages);
router.delete('/:id', deleteImage);
router.post('/bulk-delete', deleteMultipleImages);

export default router;
