const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    savedExercises: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    exerciseLog: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    chatHistory: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the 'updatedAt' timestamp on save
UserDataSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('UserData', UserDataSchema);
