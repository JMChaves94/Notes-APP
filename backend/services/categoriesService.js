const categoriesRepository = require('../repositories/categoriesRepository');
const db = require('../db/database');

// Obtener todas las categorías
const getAllCategories = async () => {
  return await categoriesRepository.getAllCategories();
};

// Crear una nueva categoría
const createCategory = async (name) => {
  return await categoriesRepository.createCategory(name);
};

// Asignar una categoría a una nota
const assignCategoryToNote = async (noteId, categoryId) => {
  return await categoriesRepository.assignCategoryToNote(noteId, categoryId);
};

// Obtener notas por categoría
const getNotesByCategory = async (categoryId) => {
  const result = await db.query(
    `
    SELECT n.*
    FROM Notes n
    INNER JOIN Notes_Categories nc ON n.id = nc.note_id
    WHERE nc.category_id = $1
    ORDER BY n.updated_at DESC
    `,
    [categoryId]
  );
  return result.rows;
};

// Exportar todos los métodos
module.exports = {
  getAllCategories,
  createCategory,
  assignCategoryToNote,
  getNotesByCategory,
};
