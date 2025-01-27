const pool = require('../db/database');

const getAllCategories = async () => {
  const result = await pool.query('SELECT * FROM Categories ORDER BY id ASC');
  return result.rows;
};

const createCategory = async (name) => {
  const result = await pool.query(
    'INSERT INTO Categories (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

const assignCategoryToNote = async (noteId, categoryId) => {
  const result = await pool.query(
    'INSERT INTO Notes_Categories (note_id, category_id) VALUES ($1, $2) RETURNING *',
    [noteId, categoryId]
  );
  return result.rows[0];
};

module.exports = {
  getAllCategories,
  createCategory,
  assignCategoryToNote,
};
