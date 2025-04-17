// Try loading environment variables, but don't fail if dotenv isn't available
try {
    require('dotenv').config();
} catch (e) {
    console.log('dotenv not found, using environment variables from the system');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Check if routes exist before requiring them
let authRoutes, userDataRoutes;
try {
    authRoutes = require('./routes/auth');
    userDataRoutes = require('./routes/user-data');
} catch (e) {
    console.error('Error loading routes:', e.message);
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for larger payloads

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000', 
    'https://new-5t2n.onrender.com',
    'https://www.rapidroutines-dashboard.org',
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Check for MongoDB URI
if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not defined');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user-data', userDataRoutes); // Register the user-data routes

// Test route
app.get('/api', (req, res) => {
    res.send('RapidRoutines API is running');
});

// Determine the correct path to the frontend build directory
const buildPath = path.resolve(__dirname, '../dist');
console.log('Serving static files from:', buildPath);

// Check if the build directory exists
const fs = require('fs');
if (!fs.existsSync(buildPath)) {
    console.warn(`Warning: Build directory not found at ${buildPath}`);
}

// Serve static files from the React app
app.use(express.static(buildPath));

// The "catchall" handler: for any request that doesn't
// match one of the routes above, send back the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoint available at http://localhost:${PORT}/api`);
});
