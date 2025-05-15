const renderMW = require('../middleware/generic/renderMW');
const deleteBookMW = require('../middleware/book/deleteBookMW');
const getBookMW = require('../middleware/book/getBookMW');
const getBooksMW = require('../middleware/book/getBooksMW');
const saveBookMW = require('../middleware/book/saveBookMW');
const deleteReviewMW = require('../middleware/review/deleteReviewMW');
const getReviewMW = require('../middleware/review/getReviewMW');
const getReviewsMW = require('../middleware/review/getReviewsMW');
const saveReviewMW = require('../middleware/review/saveReviewMW');

const BookModel = require('../models/book');
const ReviewModel = require('../models/review');

module.exports = function (app) {
    const objRepo = {
        BookModel: BookModel,
        ReviewModel: ReviewModel
    };

    // Index routes
    app.get('/',
        getBooksMW(objRepo),
        renderMW(objRepo, 'index')
    );

    app.get('/?search=:query',
        getBooksMW(objRepo),
        renderMW(objRepo, 'index')
    );

    app.get('/?filter=:genre',
        getBooksMW(objRepo),
        renderMW(objRepo, 'index')
    );

    // Database routes
    app.get('/database',
        getBooksMW(objRepo),
        renderMW(objRepo, 'database')
    );

    app.get('/database?search=:query',
        getBooksMW(objRepo),
        renderMW(objRepo, 'database')
    );

    // Book routes
    app.use('/form/book/new',
        saveBookMW(objRepo),
        renderMW(objRepo, 'bookform')
    );

    app.use('/form/book/:bookid/edit',
        getBookMW(objRepo),
        saveBookMW(objRepo),
        renderMW(objRepo, 'bookform')
    );

    app.get('/book/:bookid/delete',
        getBookMW(objRepo),
        deleteBookMW(objRepo)
    );

    app.get('/book/:bookid',
        getBookMW(objRepo),
        getReviewsMW(objRepo),
        renderMW(objRepo, 'book')
    );

    // Review routes
    app.use('/form/review/:bookid/new',
        getBookMW(objRepo),
        saveReviewMW(objRepo),
        renderMW(objRepo, 'reviewform')
    );

    app.get('/review/:bookid/:reviewid/delete',
        getReviewMW(objRepo),
        deleteReviewMW(objRepo)
    );

    // Error handling
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).end('Something broke!');
    });
};