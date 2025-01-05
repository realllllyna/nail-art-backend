const Entry = require('../models/entry');

// Get all entries
exports.getEntries = async (req, res) => {
    try {
        // Fetch all entries, now including the associated Category model using `include`
        const entries = await Entry.findAll({
            include: {
                model: require('../models/category'), // Include the Category model
                as: 'category', // Use the alias set in the `Entry` model
                attributes: ['name'], // Fetch only the 'name' field from the Category table
            },
        });
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create an entry
exports.createEntry = async (req, res) => {
    try {
        const { title, description, categoryId, imageUrl } = req.body;

        // Use categoryId as the foreign key reference
        const entry = await Entry.create({
            title,
            description,
            categoryId,  // Store the categoryId, not the category name
            imageUrl
        });

        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an entry
exports.updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, categoryId, imageUrl } = req.body;

        const entry = await Entry.findByPk(id);

        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        // Update the entry with the new fields, using categoryId instead of category
        entry.title = title;
        entry.description = description;
        entry.categoryId = categoryId; // Update using categoryId (foreign key)
        entry.imageUrl = imageUrl;

        await entry.save();
        res.status(200).json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an entry
exports.deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await Entry.findByPk(id);

        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        await entry.destroy();
        res.status(204).send(); // Successful deletion, no content in response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
