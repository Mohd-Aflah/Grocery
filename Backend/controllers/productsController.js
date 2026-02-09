import pool from '../config/database.js';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/cloudinary.js';
import Logger from '../utils/logger.js';

const logger = new Logger('ProductsController');

export const getAllProducts = async (req, res) => {
  try {
    const { category_id, is_active } = req.query;
    const connection = await pool.getConnection();
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id
    `;
    const params = [];

    if (category_id) {
      query += ' WHERE p.category_id = ?';
      params.push(category_id);
    }

    if (is_active !== undefined) {
      query += params.length > 0 ? ' AND p.is_active = ?' : ' WHERE p.is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY p.created_at DESC';

    const [products] = await connection.execute(query, params);
    connection.release();
    
    logger.info(`Fetched ${products.length} products`, { category_id, is_active });
    res.json(products);
  } catch (error) {
    logger.error('Error fetching products', error);
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const [products] = await connection.execute(
      'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [id]
    );
    
    connection.release();

    if (products.length === 0) {
      logger.warn(`Product not found`, { id });
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    logger.info(`Fetched single product`, { id });
    res.json(products[0]);
  } catch (error) {
    logger.error('Error fetching product', error);
    res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, category_id } = req.body;
    let image_url = null;
    let image_name = null;

    if (!name || !category_id) {
      return res.status(400).json({ success: false, message: 'Name and category are required' });
    }

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const cloudinaryResult = await uploadImageToCloudinary(req.file.buffer, name);
        image_url = cloudinaryResult.url;
        image_name = cloudinaryResult.publicId;
        logger.info(`Image uploaded to Cloudinary`, { publicId: image_name });
      } catch (uploadError) {
        logger.error('Error uploading image to Cloudinary', uploadError);
        return res.status(400).json({ success: false, message: 'Error uploading image to Cloudinary', error: uploadError.message });
      }
    }

    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO products (name, description, category_id, image_url, image_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, description || null, category_id, image_url, image_name]
    );

    connection.release();
    
    logger.success(`Product created`, { id: result.insertId, name });
    res.status(201).json({
      success: true,
      id: result.insertId,
      name,
      description,
      category_id,
      image_url,
      image_name,
      message: 'Product created successfully'
    });
  } catch (error) {
    logger.error('Error creating product', error);
    res.status(500).json({ success: false, message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category_id, is_active } = req.body;
    
    const connection = await pool.getConnection();
    
    // Get current product
    const [products] = await connection.execute('SELECT * FROM products WHERE id = ?', [id]);
    
    if (products.length === 0) {
      connection.release();
      logger.warn(`Product not found for update`, { id });
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const currentProduct = products[0];
    let image_url = currentProduct.image_url;
    let image_name = currentProduct.image_name;

    // Handle new image upload
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (currentProduct.image_name) {
          try {
            await deleteImageFromCloudinary(currentProduct.image_name);
            logger.info(`Old image deleted from Cloudinary`, { publicId: currentProduct.image_name });
          } catch (deleteError) {
            logger.warn('Error deleting old image from Cloudinary', deleteError);
            // Continue with upload even if delete fails
          }
        }
        
        // Upload new image
        const cloudinaryResult = await uploadImageToCloudinary(req.file.buffer, name || currentProduct.name);
        image_url = cloudinaryResult.url;
        image_name = cloudinaryResult.publicId;
        logger.info(`New image uploaded to Cloudinary`, { publicId: image_name });
      } catch (uploadError) {
        connection.release();
        logger.error('Error uploading image to Cloudinary during product update', uploadError);
        return res.status(400).json({ success: false, message: 'Error uploading image to Cloudinary', error: uploadError.message });
      }
    }

    const [result] = await connection.execute(
      `UPDATE products 
       SET name = ?, description = ?, category_id = ?, is_active = ?, image_url = ?, image_name = ?
       WHERE id = ?`,
      [name || currentProduct.name, description !== undefined ? description : currentProduct.description, 
       category_id || currentProduct.category_id, is_active !== undefined ? is_active : currentProduct.is_active,
       image_url, image_name, id]
    );

    connection.release();
    
    logger.success(`Product updated`, { id });
    res.json({ 
      success: true,
      message: 'Product updated successfully',
      product: {
        id,
        name: name || currentProduct.name,
        description: description !== undefined ? description : currentProduct.description,
        category_id: category_id || currentProduct.category_id,
        image_url,
        image_name,
        is_active: is_active !== undefined ? is_active : currentProduct.is_active
      }
    });
  } catch (error) {
    logger.error('Error updating product', error);
    res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    // Get product to delete its image
    const [products] = await connection.execute('SELECT image_name FROM products WHERE id = ?', [id]);
    
    if (products.length === 0) {
      connection.release();
      logger.warn(`Product not found for deletion`, { id });
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = products[0];

    // Delete image from Cloudinary if exists
    if (product.image_name) {
      try {
        await deleteImageFromCloudinary(product.image_name);
        logger.info(`Image deleted from Cloudinary`, { publicId: product.image_name });
      } catch (deleteError) {
        logger.warn('Error deleting image from Cloudinary', deleteError);
        // Continue with product deletion even if image delete fails
      }
    }

    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    connection.release();
    
    logger.success(`Product deleted`, { id });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Error deleting product', error);
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
};
