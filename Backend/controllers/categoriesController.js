import pool from '../config/database.js';
import Logger from '../utils/logger.js';

const logger = new Logger('CategoriesController');

export const getAllCategories = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [categories] = await connection.execute('SELECT * FROM categories ORDER BY name ASC');
    connection.release();
    
    logger.info(`Fetched ${categories.length} categories`);
    res.json(categories);
  } catch (error) {
    logger.error('Error fetching categories', error);
    res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    
    connection.release();
    
    logger.success(`Category created`, { id: result.insertId, name });
    res.status(201).json({ success: true, id: result.insertId, name, description, message: 'Category created successfully' });
  } catch (error) {
    logger.error('Error creating category', error);
    res.status(500).json({ success: false, message: 'Error creating category', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description || null, id]
    );
    
    connection.release();

    if (result.affectedRows === 0) {
      logger.warn(`Category not found for update`, { id });
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    logger.success(`Category updated`, { id });
    res.json({ success: true, id, name, description, message: 'Category updated successfully' });
  } catch (error) {
    logger.error('Error updating category', error);
    res.status(500).json({ success: false, message: 'Error updating category', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute('DELETE FROM categories WHERE id = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      logger.warn(`Category not found for deletion`, { id });
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    logger.success(`Category deleted`, { id });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    logger.error('Error deleting category', error);
    res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
  }
};
