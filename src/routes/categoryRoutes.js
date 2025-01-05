const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const router = express.Router();

// Route to get all categories
router.get('/', getCategories);

// Route to create a new category
router.post('/', createCategory);

// Route to update a category by id
router.put('/:id', updateCategory);

// Route to delete a category by id
router.delete('/:id', deleteCategory);

module.exports = router;  // Export the router to be used in the main app
