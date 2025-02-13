const { Category, Entry } = require('../models');
const { body, param, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: {
                model: Entry,
                as: 'entries',
                attributes: ['id', 'title'],
            },
            attributes: ['id', 'name', 'description'],
        });
        res.status(200).json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err.message);
        res.status(500).json({ error: 'Failed to fetch categories. Please try again later.' });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    handleValidationErrors(req, res);

    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Both name and description are required.' });
    }

    try {
        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (err) {
        console.error('Error creating category:', err.message);

        if (err.errors) {
            return res.status(400).json({ error: 'Validation error', details: err.errors });
        }
        res.status(500).json({ error: 'Failed to create category. Please try again later.' });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    handleValidationErrors(req, res);

    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found. Please check the ID and try again.' });
        }

        if (!name || !description) {
            return res.status(400).json({ error: 'Both name and description are required.' });
        }

        category.name = name;
        category.description = description;
        await category.save();

        res.status(200).json(category);
    } catch (err) {
        console.error('Error updating category:', err.message);
        res.status(500).json({ error: 'Failed to update category. Please try again later.' });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    handleValidationErrors(req, res);

    const { id } = req.params;

    try {
        console.log('Received ID for deletion:', id);

        // Find the category by ID
        const category = await Category.findByPk(id);
        if (!category) {
            console.log('Category not found for ID:', id);
            return res.status(404).json({ error: 'Category not found. Please check the ID and try again.' });
        }

        console.log('Found category:', category);

        // Unassign entries associated with the category
        const updatedEntries = await Entry.update({ categoryId: null }, { where: { categoryId: id } });
        console.log('Entries updated:', updatedEntries);

        // Delete the category
        console.log('Attempting to delete category...');
        await category.destroy();
        console.log('Category deleted successfully');

        res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (err) {
        console.error('Error deleting category:', err.stack || err.message || err);
        res.status(500).json({ error: 'Failed to delete category. Please try again later.' });
    }
};