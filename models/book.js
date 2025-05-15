const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Book = db.model('Book', {
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = Book;