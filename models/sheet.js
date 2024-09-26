const mongoose = require('../config/mongoose');
const Schema = mongoose.Schema;

const sheetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    collaborators: [{
        type: String,
        ref: 'User',
        default: []
    }],
    data: {
        type: [[Schema.Types.Mixed]], // Enforces a 2D array
        required: true
    },
    owner: {
        type: String,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Sheet = mongoose.model('Sheet', sheetSchema);

module.exports = Sheet;