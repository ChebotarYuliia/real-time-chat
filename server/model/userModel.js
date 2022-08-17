const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: '',
    },
    contacts: {
        type: Array,
        default: [],
    },
    settings: {
        pins: Array,
        theme: String,
    },
});

// userSchema.index({ username: 'text', email: 'text' });
module.exports = mongoose.model('Users', userSchema);