import cloudinary from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (buffer, productName) => {
  return new Promise((resolve, reject) => {
    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);
    
    // Configure upload options
    const uploadOptions = {
      folder: process.env.CLOUDINARY_FOLDER || 'abdul-rasheed-grocery',
      public_id: `${productName.replace(/\s+/g, '_')}_${Date.now()}`,
      resource_type: 'auto',
      overwrite: true
    };

    // Upload to Cloudinary
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            fileName: result.original_filename
          });
        }
      }
    );

    stream.pipe(uploadStream);
  });
};

// Delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;
