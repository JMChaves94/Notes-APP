const notesService = require('../services/notesService');

// Obtener todas las notas, con opción de filtrar por categoría
const getAllNotes = async (req, res) => {
  const { categoryId } = req.query; // Recoge el parámetro de categoría desde la URL
  console.log('Fetching all notes...');
  try {
    console.log('Category ID received:', categoryId);
    const notes = await notesService.getAllNotes(categoryId); // Pasa el filtro al servicio
    console.log('Notes fetched successfully:', notes);
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    res.status(500).json({ error: 'Error fetching notes', details: error.message });
  }
};

// Crear una nueva nota
const createNote = async (req, res) => {
  const { title, content, status, categoryId } = req.body;
  console.log('Creating a new note:', { title, content, status, categoryId });
  try {
    const newNote = await notesService.createNote(title, content, status, categoryId);
    console.log('Note created successfully:', newNote);
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error.message);
    res.status(500).json({ error: 'Error creating note', details: error.message });
  }
};

// Actualizar una nota existente
const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, status, categoryId } = req.body;
  console.log(`Updating the note with ID ${id}:`, { title, content, status, categoryId });
  try {
    const updatedNote = await notesService.updateNote(id, title, content, status, categoryId);
    if (!updatedNote) {
      console.warn(`Note with ID ${id} not found`);
      return res.status(404).json({ error: 'Note not found' });
    }
    console.log('Note updated successfully:', updatedNote);
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error.message);
    res.status(500).json({ error: 'Error updating note', details: error.message });
  }
};

// Eliminar una nota
const deleteNote = async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting the note with ID ${id}`);
  try {
    const deletedNote = await notesService.deleteNote(id);
    if (!deletedNote) {
      console.warn(`Note with ID ${id} not found`);
      return res.status(404).json({ error: 'Note not found' });
    }
    console.log('Note deleted successfully:', deletedNote);
    res.status(200).json(deletedNote);
  } catch (error) {
    console.error('Error deleting note:', error.message);
    res.status(500).json({ error: 'Error deleting note', details: error.message });
  }
};

// Asignar una categoría a una nota
const assignCategoryToNote = async (req, res) => {
  const { id } = req.params;
  const { categoryId } = req.body;
  console.log(`Assigning category ${categoryId} to note ${id}`);
  try {
    const result = await notesService.assignCategoryToNote(id, categoryId);
    if (!result) {
      console.warn(`Note or category not found: noteId=${id}, categoryId=${categoryId}`);
      return res.status(404).json({ error: 'Note or category not found' });
    }
    console.log('Category assigned successfully:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error assigning category to note:', error.message);
    res.status(500).json({ error: 'Error assigning category to note', details: error.message });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  assignCategoryToNote,
};
