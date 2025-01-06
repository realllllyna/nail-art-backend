require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./src/db');
const categoryRoutes = require('./src/routes/categoryRoutes');
const entryRoutes = require('./src/routes/entryRoutes');

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/categories', categoryRoutes); // Handle requests for categories
app.use('/entries', entryRoutes);       // Handle requests for entries
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// Serve frontend static files
app.use(express.static(path.resolve(__dirname, '../frontend/dist')));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.message);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
});

// Start the Server
const startServer = async () => {
    try {
        await sequelize.sync({ alter: true }); // Sync database with models
        console.log('Database synchronized successfully');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Database synchronization error:', err.message);
        process.exit(1); // Exit process on fatal error
    }
};

// Start the application
startServer();