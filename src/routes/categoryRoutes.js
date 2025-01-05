const express = require('express');
const { body, param } = require('express-validator');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const router = express.Router();

// Route to get all categories
router.get('/', getCategories);

// Route to create a new category
router.post(
    '/',
    [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isString()
            .withMessage('Name must be a string')
            .isLength({ max: 50 })
            .withMessage('Name cannot exceed 50 characters'),
        body('description')
            .optional()
            .isString()
            .withMessage('Description must be a string')
            .isLength({ max: 200 })
            .withMessage('Description cannot exceed 200 characters'),
    ],
    createCategory
);

// Route to update a category by id
router.put(
    '/:id',
    [
        param('id')
            .isInt()
            .withMessage('Category ID must be a valid integer'),
        body('name')
            .optional()
            .isString()
            .withMessage('Name must be a string')
            .isLength({ max: 50 })
            .withMessage('Name cannot exceed 50 characters'),
        body('description')
            .optional()
            .isString()
            .withMessage('Description must be a string')
            .isLength({ max: 200 })
            .withMessage('Description cannot exceed 200 characters'),
    ],
    updateCategory
);

// Route to delete a category by id
router.delete(
    '/:id',
    [
        param('id')
            .isInt()
            .withMessage('Category ID must be a valid integer'),
    ],
    deleteCategory
);

module.exports = router; // Export the router to be used in the main app
