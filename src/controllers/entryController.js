const { Category, Entry } = require('../models');

// Get all entries
exports.getEntries = async (req, res) => {
    try {
        const entries = await Entry.findAll({
            include: {
                model: Category,
                as: 'category',
                attributes: ['name'], // Fetch only the 'name' field from the Category table
            },
        });
        res.status(200).json(entries);
    } catch (err) {
        console.error('Error fetching entries:', err.message);
        res.status(500).json({ error: 'Failed to fetch entries. Please try again later.' });
    }
};

// Create a new entry
exports.createEntry = async (req, res) => {
    try {
        const {
            title,
            description,
            categoryId,
            imageUrl,
            price,
            artist,
            duration,
            colorOptions,
            materials,
            aftercare,
            allergyWarnings,
            availability,
        } = req.body;

        // Validate categoryId
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Invalid categoryId. Please select a valid category.' });
        }

        // Create the new entry
        const newEntry = await Entry.create({
            title,
            description,
            categoryId,
            imageUrl,
            price,
            artist,
            duration,
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
        res.status(500).json({ error: 'Failed to create entry. Please try again later.' });
    }
};

// Update an entry by ID
exports.updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            categoryId,
            imageUrl,
            price,
            artist,
            duration,
            colorOptions,
            materials,
            aftercare,
            allergyWarnings,
            availability,
        } = req.body;

        // Validate entry existence
        const entry = await Entry.findByPk(id);
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found. Please check the ID and try again.' });
        }

        // Validate categoryId existence
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Invalid categoryId. Please select a valid category.' });
        }

        // Update the entry with new data
        Object.assign(entry, {
            title,
            description,
            categoryId,
            imageUrl,
            price,
            artist,
            duration,
            colorOptions,
            materials,
            aftercare,
            allergyWarnings,
            availability,
        });

        await entry.save();

        // Include updated category in the response
        const updatedEntry = await Entry.findByPk(id, {
            include: {
                model: Category,
                as: 'category',
                attributes: ['name'],
            },
        });

        res.status(200).json(updatedEntry);
    } catch (err) {
        console.error('Error updating entry:', err.message);
        res.status(500).json({ error: 'Failed to update entry. Please try again later.' });
    }
};

// Delete an entry by ID
exports.deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate entry existence
        const entry = await Entry.findByPk(id);
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found. Please check the ID and try again.' });
        }

        await entry.destroy();
        res.status(200).json({ message: 'Entry deleted successfully.' });
    } catch (err) {
        console.error('Error deleting entry:', err.message);
        res.status(500).json({ error: 'Failed to delete entry. Please try again later.' });
    }
};