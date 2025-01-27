const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve all categories from the database.
 *     responses:
 *       200:
 *         description: A list of categories.
 */
router.get('/', categoriesController.getAllCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     description: Add a new category to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully.
 */
router.post('/', categoriesController.createCategory);

/**
 * @swagger
 * /categories/{categoryId}/notes:
 *   get:
 *     summary: Get notes by category
 *     description: Retrieve all notes that belong to a specific category.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to filter by.
 *     responses:
 *       200:
 *         description: A list of notes filtered by category.
 */
router.get('/:categoryId/notes', categoriesController.getNotesByCategory);

module.exports = router;
