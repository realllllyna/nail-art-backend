const express = require('express');
const router = express.Router();
const Entry = require('../models/entry'); // Import Entry model
const Category = require('../models/category'); // Import Category model
const { body, param, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Get all entries (for Gallery.vue)
router.get('/', async (req, res) => {
    try {
        const entries = await Entry.findAll({
            include: {
                model: Category,
                as: 'category', // Alias set in the Entry model
                attributes: ['name'], // Fetch only the 'name' of the category
            }
        });
        res.json(entries);
    } catch (error) {
        console.error('Error fetching entries:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a single entry by ID (for NailArtDetail.vue)
router.get('/:id', [
    param('id').isInt().withMessage('ID must be a valid integer'),
], async (req, res) => {
    handleValidationErrors(req, res);
    try {
        const entry = await Entry.findByPk(req.params.id, {
            include: {
                model: Category,
                as: 'category', // Alias set in the Entry model
                attributes: ['name'], // Fetch only the 'name' of the category
            }
        });
        if (entry) {
            res.json(entry);
        } else {
            res.status(404).json({ error: 'Entry not found' });
        }
    } catch (error) {
        console.error('Error fetching entry:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new entry (for AddNail.vue)
router.post('/add', [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('categoryId').isInt().withMessage('Category ID must be an integer'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('artist').notEmpty().withMessage('Artist is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('imageUrl').optional().isString().withMessage('Image URL must be a string'),
    body('colorOptions').optional().isString().withMessage('Color options must be a string'),
    body('materials').optional().isString().withMessage('Materials must be a string'),
    body('aftercare').optional().isString().withMessage('Aftercare must be a string'),
    body('allergyWarnings').optional().isString().withMessage('Allergy warnings must be a string'),
    body('availability').optional().isString().withMessage('Availability must be a string'),
], async (req, res) => {
    handleValidationErrors(req, res);

    try {
        const {
            title,
            description,
            categoryId,
            price,
            artist,
            duration,
            imageUrl,
            colorOptions,
            materials,
            aftercare,
            allergyWarnings,
            availability,
        } = req.body;

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Invalid categoryId' });
        }

        const newEntry = await Entry.create({
            title,
            description,
            categoryId,
            price,
            artist,
            duration,
            imageUrl,
            colorOptions,
            materials,
            aftercare,
            allergyWarnings,
            availability,
        });

        console.log('New entry created:', newEntry);
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error creating entry:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update an entry by ID (for editing in NailArtDetail.vue)
router.put('/:id', [
    param('id').isInt().withMessage('ID must be a valid integer'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('categoryId').isInt().withMessage('Category ID must be an integer'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('artist').notEmpty().withMessage('Artist is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('imageUrl').optional().isString().withMessage('Image URL must be a string'),
    body('colorOptions').optional().isString().withMessage('Color options must be a string'),
    body('materials').optional().isString().withMessage('Materials must be a string'),
    body('aftercare').optional().isString().withMessage('Aftercare must be a string'),
    body('allergyWarnings').optional().isString().withMessage('Allergy warnings must be a string'),
    body('availability').optional().isString().withMessage('Availability must be a string'),
], async (req, res) => {
    handleValidationErrors(req, res);

    try {
        const entry = await Entry.findByPk(req.params.id);
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        const category = await Category.findByPk(req.body.categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Invalid categoryId' });
        }

        Object.assign(entry, req.body);
        await entry.save();

        res.status(200).json(entry);
    } catch (error) {
        console.error('Error updating entry:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete an entry by ID (for deleting in NailArtDetail.vue)
router.delete('/:id', [
    param('id').isInt().withMessage('ID must be a valid integer'),
], async (req, res) => {
    handleValidationErrors(req, res);

    try {
        const entry = await Entry.findByPk(req.params.id);
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        await entry.destroy();
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting entry:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
