const db = require('../db/database');

// Obtener todas las notas con la opción de filtrar por categoría
const getAllNotes = async (categoryId = null) => {
  try {
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
      console.log('Fetching notes with categoryId:', categoryId);
      const result = await db.query(query, [categoryId]);
      return result.rows;
    } else {
      // Si no se pasa un `categoryId`, devolver todas las notas
      query += ` ORDER BY notes.updated_at DESC`;
      console.log('Fetching all notes without category filter.');
      const result = await db.query(query);
      return result.rows;
    }
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    throw new Error('Error fetching notes: ' + error.message);
  }
};

// Crear una nueva nota con categoría (opcional)
const createNote = async (title, content, status, categoryId = null) => {
  try {
    console.log('Creating note:', { title, content, status, categoryId });
    const result = await db.query(
      'INSERT INTO Notes (title, content, status, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, status, categoryId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating note:', error.message);
    throw new Error('Error creating note: ' + error.message);
  }
};

// Actualizar una nota existente con la posibilidad de cambiar su categoría
const updateNote = async (id, title, content, status, categoryId = null) => {
  try {
    console.log(`Updating note with ID ${id}:`, { title, content, status, categoryId });
    const result = await db.query(
      'UPDATE Notes SET title = $1, content = $2, status = $3, category_id = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, content, status, categoryId, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating note:', error.message);
    throw new Error('Error updating note: ' + error.message);
  }
};

// Eliminar una nota
const deleteNote = async (id) => {
  try {
    console.log(`Deleting note with ID ${id}`);
    const result = await db.query(
      'DELETE FROM Notes WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting note:', error.message);
    throw new Error('Error deleting note: ' + error.message);
  }
};

// Asignar una categoría a una nota (opcional si usas tabla intermedia)
const assignCategoryToNote = async (noteId, categoryId) => {
  try {
    console.log(`Assigning category ${categoryId} to note ${noteId}`);
    const result = await db.query(
      'UPDATE Notes SET category_id = $1 WHERE id = $2 RETURNING *',
      [categoryId, noteId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error assigning category to note:', error.message);
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
