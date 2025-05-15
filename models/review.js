const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Review = db.model('Review', {
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        required: true
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }
});

module.exports = Review;