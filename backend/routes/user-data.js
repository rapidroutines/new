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

    // Allowed data types
    const allowedTypes = ['savedExercises', 'exerciseLog', 'chatHistory'];
    if (!allowedTypes.includes(dataType)) {
        return res.status(400).json({ message: 'Invalid data type' });
    }

    try {
        // Find or create user data document
        let userDataDoc = await UserData.findOne({ user: req.user.id });

        if (!userDataDoc) {
            userDataDoc = new UserData({
                user: req.user.id,
                savedExercises: [],
                exerciseLog: [],
                chatHistory: []
            });
        }

        // Update specific data type
        userDataDoc[dataType] = data;

        // Save the document
        await userDataDoc.save();

        res.status(200).json({ message: 'Data saved successfully' });
    } catch (err) {
        console.error(`Error saving ${dataType}:`, err);
        res.status(500).json({ message: 'Server error saving data' });
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
                chatHistory: []
            });
        }

        res.status(200).json({
            savedExercises: userData.savedExercises || [],
            exerciseLog: userData.exerciseLog || [],
            chatHistory: userData.chatHistory || []
        });
    } catch (err) {
        console.error('Error retrieving user data:', err);
        res.status(500).json({ message: 'Server error retrieving data' });
    }
});

module.exports = router;
