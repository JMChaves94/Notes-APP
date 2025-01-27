const db = require('../db/database');

// Obtener todas las notas con la opción de filtrar por categoría
const getAllNotes = async (categoryId = null) => {
  let query = `
    SELECT 
      notes.*,
      categories.name AS category_name
    FROM notes
    LEFT JOIN categories ON notes.category_id = categories.id
  `;

  if (categoryId) {
    // Si se pasa un `categoryId`, filtrar las notas por esa categoría
    query += ` WHERE notes.category_id = $1 ORDER BY notes.updated_at DESC`;
    const result = await db.query(query, [categoryId]);
    return result.rows;
  } else {
    // Si no se pasa un `categoryId`, devolver todas las notas
    query += ` ORDER BY notes.updated_at DESC`;
    const result = await db.query(query);
    return result.rows;
  }
};

// Crear una nueva nota con categoría (opcional)
const createNote = async (title, content, status, categoryId = null) => {
  const result = await db.query(
    'INSERT INTO Notes (title, content, status, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, content, status, categoryId]
  );
  return result.rows[0];
};

// Actualizar una nota existente con la posibilidad de cambiar su categoría
const updateNote = async (id, title, content, status, categoryId = null) => {
  const result = await db.query(
    'UPDATE Notes SET title = $1, content = $2, status = $3, category_id = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
    [title, content, status, categoryId, id]
  );
  return result.rows[0];
};

// Eliminar una nota
const deleteNote = async (id) => {
  const result = await db.query(
    'DELETE FROM Notes WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

// Asignar una categoría a una nota (opcional si usas tabla intermedia)
const assignCategoryToNote = async (noteId, categoryId) => {
  try {
    const result = await db.query(
      'UPDATE Notes SET category_id = $1 WHERE id = $2 RETURNING *',
      [categoryId, noteId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error assigning category to note: ' + error.message);
  }
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  assignCategoryToNote,
};
