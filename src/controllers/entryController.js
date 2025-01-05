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
        return res.status(400).json({ error: 'Invalid categoryId' });
      }
  
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
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Update an entry
exports.updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, categoryId, imageUrl, price, artist, duration, colorOptions, materials, aftercare, allergyWarnings, availability } = req.body;

        const entry = await Entry.findByPk(id);

        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        // Validate if categoryId exists in Categories table
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Invalid categoryId' });
        }

        // Update the entry with the new fields
        entry.title = title;
        entry.description = description;
        entry.categoryId = categoryId;  // Use categoryId (foreign key)
        entry.imageUrl = imageUrl;
        entry.price = price;
        entry.artist = artist;
        entry.duration = duration;
        entry.colorOptions = colorOptions;
        entry.materials = materials;
        entry.aftercare = aftercare;
        entry.allergyWarnings = allergyWarnings;
        entry.availability = availability;

        await entry.save();  // Save the updated entry

        // Return the updated entry along with the associated category
        const updatedEntry = await Entry.findByPk(id, {
            include: {
                model: Category,
                as: 'category', // Include category as part of the response
                attributes: ['name']
            }
        });

        res.status(200).json(updatedEntry);  // Return the updated entry with category
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
