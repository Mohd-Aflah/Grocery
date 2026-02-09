import pool from '../config/database.js';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/cloudinary.js';
import Logger from '../utils/logger.js';

const logger = new Logger('GalleryController');

export const getAllImages = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [images] = await connection.execute(
      'SELECT * FROM gallery_images ORDER BY created_at DESC'
    );
    
    connection.release();
    
    logger.info(`Fetched ${images.length} gallery images`);
    res.json(images);
  } catch (error) {
    logger.error('Error fetching gallery images', error);
    res.status(500).json({ success: false, message: 'Error fetching gallery images', error: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    let image_url = null;
    let image_name = null;
    let cloudinary_public_id = null;

    // Upload to Cloudinary
    try {
      const cloudinaryResult = await uploadImageToCloudinary(req.file.buffer, `gallery_${Date.now()}`);
      image_url = cloudinaryResult.url;
      image_name = cloudinaryResult.fileName;
      cloudinary_public_id = cloudinaryResult.publicId;
      logger.info(`Image uploaded to Cloudinary`, { publicId: cloudinary_public_id });
    } catch (uploadError) {
      logger.error('Error uploading image to Cloudinary', uploadError);
      return res.status(400).json({ success: false, message: 'Error uploading image to Cloudinary', error: uploadError.message });
    }

    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO gallery_images (image_url, image_name, cloudinary_public_id) 
       VALUES (?, ?, ?)`,
      [image_url, image_name, cloudinary_public_id]
    );

    connection.release();
    
    logger.success(`Gallery image uploaded`, { id: result.insertId });
    res.status(201).json({
      success: true,
      id: result.insertId,
      image_url,
      image_name,
      cloudinary_public_id,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    logger.error('Error uploading gallery image', error);
    res.status(500).json({ success: false, message: 'Error uploading gallery image', error: error.message });
  }
};

export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided' });
    }

    const connection = await pool.getConnection();
    const uploadedImages = [];
    const errors = [];

    for (let i = 0; i < req.files.length; i++) {
      try {
        const file = req.files[i];
        const cloudinaryResult = await uploadImageToCloudinary(file.buffer, `gallery_${Date.now()}_${i}`);
        
        const [result] = await connection.execute(
          `INSERT INTO gallery_images (image_url, image_name, cloudinary_public_id) 
           VALUES (?, ?, ?)`,
          [cloudinaryResult.url, cloudinaryResult.fileName, cloudinaryResult.publicId]
        );

        uploadedImages.push({
          id: result.insertId,
          image_url: cloudinaryResult.url,
          image_name: cloudinaryResult.fileName,
          cloudinary_public_id: cloudinaryResult.publicId
        });

        logger.info(`Gallery image uploaded`, { index: i, publicId: cloudinaryResult.publicId });
      } catch (error) {
        logger.error(`Error uploading gallery image ${i}`, error);
        errors.push({ index: i, message: error.message });
      }
    }

    connection.release();
    
    logger.success(`Bulk uploaded ${uploadedImages.length} gallery images`);
    res.status(201).json({
      success: true,
      uploadedCount: uploadedImages.length,
      failedCount: errors.length,
      images: uploadedImages,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully uploaded ${uploadedImages.length} image(s)`
    });
  } catch (error) {
    logger.error('Error bulk uploading gallery images', error);
    res.status(500).json({ success: false, message: 'Error bulk uploading gallery images', error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    // Get image to delete
    const [images] = await connection.execute(
      'SELECT cloudinary_public_id FROM gallery_images WHERE id = ?',
      [id]
    );
    
    if (images.length === 0) {
      connection.release();
      logger.warn(`Gallery image not found for deletion`, { id });
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const image = images[0];

    // Delete from Cloudinary
    if (image.cloudinary_public_id) {
      try {
        await deleteImageFromCloudinary(image.cloudinary_public_id);
        logger.info(`Gallery image deleted from Cloudinary`, { publicId: image.cloudinary_public_id });
      } catch (deleteError) {
        logger.warn('Error deleting image from Cloudinary', deleteError);
        // Continue with DB deletion even if Cloudinary delete fails
      }
    }

    // Delete from database
    await connection.execute('DELETE FROM gallery_images WHERE id = ?', [id]);
    connection.release();
    
    logger.success(`Gallery image deleted`, { id });
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    logger.error('Error deleting gallery image', error);
    res.status(500).json({ success: false, message: 'Error deleting gallery image', error: error.message });
  }
};

export const deleteMultipleImages = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No image IDs provided' });
    }

    const connection = await pool.getConnection();
    const deletedIds = [];
    const errors = [];

    for (let i = 0; i < ids.length; i++) {
      try {
        const id = ids[i];
        
        // Get image to delete
        const [images] = await connection.execute(
          'SELECT cloudinary_public_id FROM gallery_images WHERE id = ?',
          [id]
        );
        
        if (images.length === 0) {
          errors.push({ id, message: 'Image not found' });
          continue;
        }

        const image = images[0];

        // Delete from Cloudinary
        if (image.cloudinary_public_id) {
          try {
            await deleteImageFromCloudinary(image.cloudinary_public_id);
          } catch (deleteError) {
            logger.warn(`Error deleting image ${id} from Cloudinary`, deleteError);
          }
        }

        // Delete from database
        await connection.execute('DELETE FROM gallery_images WHERE id = ?', [id]);
        deletedIds.push(id);
        logger.info(`Gallery image deleted`, { id });
      } catch (error) {
        logger.error(`Error deleting gallery image ${ids[i]}`, error);
        errors.push({ id: ids[i], message: error.message });
      }
    }

    connection.release();
    
    logger.success(`Bulk deleted ${deletedIds.length} gallery images`);
    res.json({
      success: true,
      deletedCount: deletedIds.length,
      failedCount: errors.length,
      deletedIds,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully deleted ${deletedIds.length} image(s)`
    });
  } catch (error) {
    logger.error('Error bulk deleting gallery images', error);
    res.status(500).json({ success: false, message: 'Error bulk deleting gallery images', error: error.message });
  }
};

export default {
  getAllImages,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages
};
