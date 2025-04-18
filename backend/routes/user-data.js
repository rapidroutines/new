const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// Model for user data
const UserData = require('../models/user-data');

// Save user data (generic endpoint for different types)
router.post('/save-data', auth, async (req, res) => {
    const { dataType, data } = req.body;

    // Validate input
    if (!dataType || !data) {
        return res.status(400).json({ message: 'Data type and content are required' });
    }

    // Allowed data types - adding trackerExercises to the allowed types
    const allowedTypes = ['savedExercises', 'exerciseLog', 'chatHistory', 'rapidTreeProgress', 'trackerExercises'];
    if (!allowedTypes.includes(dataType)) {
        return res.status(400).json({ message: 'Invalid data type' });
    }

    try {
        // Use findOneAndUpdate with upsert to handle concurrent updates
        const updatedUserData = await UserData.findOneAndUpdate(
            { user: req.user.id },
            { 
                [dataType]: data,
                $setOnInsert: { user: req.user.id },
                updatedAt: Date.now() 
            },
            { 
                upsert: true,  // Create document if it doesn't exist
                new: true,     // Return the modified document
                setDefaultsOnInsert: true,
                runValidators: true,
                context: 'query'
            }
        );

        res.status(200).json({ 
            message: 'Data saved successfully',
            data: updatedUserData 
        });
    } catch (err) {
        console.error(`Error saving ${dataType}:`, err);
        
        // More detailed error handling
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Invalid data format', 
                details: err.errors 
            });
        }

        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(409).json({ 
                message: 'Duplicate key error', 
                details: err.message 
            });
        }

        res.status(500).json({ 
            message: 'Server error saving data',
            error: err.message 
        });
    }
});

// Retrieve user data
router.get('/get-data', auth, async (req, res) => {
    try {
        const userData = await UserData.findOne({ user: req.user.id });

        if (!userData) {
            return res.status(200).json({
                savedExercises: [],
                exerciseLog: [],
                chatHistory: [],
                rapidTreeProgress: {},
                trackerExercises: [] // Adding empty trackerExercises array as default
            });
        }

        res.status(200).json({
            savedExercises: userData.savedExercises || [],
            exerciseLog: userData.exerciseLog || [],
            chatHistory: userData.chatHistory || [],
            rapidTreeProgress: userData.rapidTreeProgress || {},
            trackerExercises: userData.trackerExercises || [] // Include trackerExercises in response
        });
    } catch (err) {
        console.error('Error retrieving user data:', err);
        res.status(500).json({ message: 'Server error retrieving data' });
    }
});

module.exports = router;
