const categoriesService = require('../services/categoriesService');

// Obtener todas las categorías
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoriesService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).send('Error fetching categories');
  }
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await categoriesService.createCategory(name);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error.message);
    res.status(500).send('Error creating category');
  }
};

// Asignar una categoría a una nota
const assignCategoryToNote = async (req, res) => {
  const { id } = req.params; // ID de la nota
  const { categoryId } = req.body; // ID de la categoría
  try {
    const assignment = await categoriesService.assignCategoryToNote(id, categoryId);
    res.status(200).json(assignment);
  } catch (error) {
    console.error('Error assigning category to note:', error.message);
    res.status(500).send('Error assigning category to note');
  }
};

// Obtener notas filtradas por categoría
const getNotesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const notes = await categoriesService.getNotesByCategory(categoryId);
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes by category:', error.message);
    res.status(500).send('Error fetching notes by category');
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  assignCategoryToNote,
  getNotesByCategory,
};
