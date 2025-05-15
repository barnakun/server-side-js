/*
 * A könyv mentésére szolgáló middleware
 * Handles both creating new books and updating existing ones
 */
module.exports = function(objectRepository) {
    const BookModel = objectRepository.BookModel;
    return (req, res, next) => {
        if (!req.body.title || !req.body.author || !req.body.genre || !req.body.description) {
            return next();
        }

        let b = new BookModel();

        if (typeof res.locals.book !== 'undefined') {
            b = res.locals.book;
        }

        b.title = req.body.title;
        b.author = req.body.author;
        b.genre = req.body.genre;
        b.description = req.body.description;

        return b.save().then(() => {
            return res.redirect('/database');
        }).catch(err => {
            console.error(err);
            return next(err);
        });
    }
};