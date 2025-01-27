const { pool } = require('../db/database');

// Obtener todas las notas
const getAllNotes = async () => {
  const result = await pool.query('SELECT * FROM Notes ORDER BY updated_at DESC');
  return result.rows;
};

// Crear una nueva nota
const createNote = async ({ title, content, status }) => {
  const result = await pool.query(
    'INSERT INTO Notes (title, content, status) VALUES ($1, $2, $3) RETURNING *',
    [title, content, status]
  );
  return result.rows[0];
};

// Actualizar una nota existente
const updateNote = async (id, { title, content, status }) => {
  const result = await pool.query(
    'UPDATE Notes SET title = $1, content = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
    [title, content, status, id]
  );
  return result.rows[0];
};

// Eliminar una nota
const deleteNote = async (id) => {
  const result = await pool.query('DELETE FROM Notes WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// Obtener notas por categoría
const getNotesByCategory = async (categoryId) => {
  const query = `
    SELECT n.*
    FROM notes n
    INNER JOIN notes_categories nc ON n.id = nc.note_id
    WHERE nc.category_id = $1
  `;
  const values = [categoryId];
  const result = await pool.query(query, values);
  return result.rows;
};


module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getNotesByCategory
};
