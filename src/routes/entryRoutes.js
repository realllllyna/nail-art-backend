const express = require('express');
const router = express.Router();
const Entry = require('../models/entry'); // Adjust the path if needed
const Category = require('../models/category'); // Import Category model
const { body, validationResult } = require('express-validator');

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
router.get('/:id', async (req, res) => {
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
router.post('/', [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('categoryId').isInt().withMessage('categoryId must be an integer'),
], async (req, res) => {
    // Validate incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, categoryId, imageUrl } = req.body;

        // Validate if categoryId exists in Categories table
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Invalid categoryId' });
        }

        const newEntry = await Entry.create({ title, description, categoryId, imageUrl });
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error creating entry:', error.message);
        res.status(400).json({ error: 'Bad Request' });
    }
});

// Update an entry by ID (for editing in NailArtDetail.vue)
router.put('/:id', [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('categoryId').isInt().withMessage('categoryId must be an integer'),
], async (req, res) => {
    // Validate incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { title, description, categoryId, imageUrl } = req.body;

        const entry = await Entry.findByPk(id);
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        // Validate if categoryId exists in Categories table
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Invalid categoryId' });
        }

        entry.title = title;
        entry.description = description;
        entry.categoryId = categoryId; // Update categoryId (foreign key)
        entry.imageUrl = imageUrl;

        await entry.save();
        res.json(entry);
    } catch (error) {
        console.error('Error updating entry:', error.message);
        res.status(400).json({ error: 'Bad Request' });
    }
});

// Delete an entry by ID (for deleting in NailArtDetail.vue)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await Entry.findByPk(id);

        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        await entry.destroy(); // Delete the entry from the database
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting entry:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
