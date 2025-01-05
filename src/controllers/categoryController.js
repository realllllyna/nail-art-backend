const Category = require('../models/category');
const { body, validationResult } = require('express-validator');

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a category
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = await Category.create({ name, description });
        res.status(201).json(category); // Successfully created category
    } catch (err) {
        // Log the full error details to understand what's causing the validation error
        console.error('Error creating category:', err);

        // Send a more detailed error response to the client
        if (err.errors) {
            return res.status(400).json({ error: 'Validation error', details: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Find the category by primary key (id)
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Update the category with the new data
        category.name = name || category.name; // Only update if a new name is provided
        category.description = description || category.description; // Only update if a new description is provided
        await category.save();

        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Destroy the category
        await category.destroy();
        res.status(204).send(); // Successfully deleted, no content in response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
