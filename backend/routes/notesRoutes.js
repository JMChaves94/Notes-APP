const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes
 *     description: Retrieve all notes from the database.
 *     responses:
 *       200:
 *         description: A list of notes.
 */
router.get('/', notesController.getAllNotes);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     description: Add a new note to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Note created successfully.
 */
router.post('/', notesController.createNote);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a note
 *     description: Update an existing note in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the note to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Note updated successfully.
 */
router.put('/:id', notesController.updateNote);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Remove a note from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the note to delete.
 *     responses:
 *       200:
 *         description: Note deleted successfully.
 */
router.delete('/:id', notesController.deleteNote);

/**
 * @swagger
 * /notes/{id}/categories:
 *   post:
 *     summary: Assign a category to a note
 *     description: Assign a category to an existing note in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the note to assign the category to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Category assigned successfully.
 */
router.post('/:id/categories', notesController.assignCategoryToNote);

module.exports = router;
