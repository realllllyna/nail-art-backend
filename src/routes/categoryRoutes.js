const express = require('express');
const { body, param } = require('express-validator');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const router = express.Router();

/**
 * Route to get all categories
 * GET /categories
 */
router.get('/', getCategories);

/**
 * Route to create a new category
 * POST /categories
 */
router.post(
    '/',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isString()
            .withMessage('Name must be a string')
            .isLength({ max: 50 })
            .withMessage('Name cannot exceed 50 characters'),
        body('description')
            .optional()
            .trim()
            .isString()
            .withMessage('Description must be a string')
            .isLength({ max: 200 })
            .withMessage('Description cannot exceed 200 characters'),
    ],
    createCategory
);

/**
 * Route to update a category by ID
 * PUT /categories/:id
 */
router.put(
    '/:id',
    [
        param('id')
            .toInt()
            .isInt({ min: 1 })
            .withMessage('Category ID must be a valid integer greater than 0'),
        body('name')
            .optional()
            .trim()
            .isString()
            .withMessage('Name must be a string')
            .isLength({ max: 50 })
            .withMessage('Name cannot exceed 50 characters'),
        body('description')
            .optional()
            .trim()
            .isString()
            .withMessage('Description must be a string')
            .isLength({ max: 200 })
            .withMessage('Description cannot exceed 200 characters'),
    ],
    updateCategory
);

/**
 * Route to delete a category by ID
 * DELETE /categories/:id
 */
router.delete(
    '/:id',
    [
        param('id')
            .toInt()
            .isInt({ min: 1 })
            .withMessage('Category ID must be a valid integer greater than 0'),
    ],
    deleteCategory
);

module.exports = router; // Export the router to be used in the main app