const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');  // Resolve paths
const sequelize = require('./src/db');
const categoryRoutes = require('./src/routes/categoryRoutes');
const entryRoutes = require('./src/routes/entryRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/categories', categoryRoutes);  // Handle requests for categories
app.use('/entries', entryRoutes);  // Handle requests for entries
app.use('/uploads', express.static('uploads'));  // Serve images from the 'uploads' folder

// Serve frontend static files
app.use(express.static(path.resolve(__dirname, '../frontend/dist')));

// Database Sync
sequelize.sync({ alter: true })  // Sync the database with models, `alter` adjusts schema automatically
    .then(() => {
        console.log('Database synchronized successfully');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  // Server starts listening
    })
    .catch((err) => {
        console.error('Database sync error:', err.message);
        process.exit(1);  // Exit if database sync fails
    });
