/*
 * Egy könyv egyed lekérdezése URL-paraméter alapján
 */
module.exports = function(objectRepository) {
    const BookModel = objectRepository.BookModel;
    return (req, res, next) => {
        // req.param() is the Express 4 convenience helper (deprecated in 4.x, removed in 5.x).
        // In Express 5 this line throws: TypeError: req.param is not a function
        const bookid = req.param('bookid');
        BookModel.findOne({
            _id: bookid
        }).then(book => {
            if (!book) {
                return res.redirect('/database');
            }
            res.locals.book = book;
            return next();
        }).catch(err => {
            console.error(err);
            return next(err);
        });
    };
};
