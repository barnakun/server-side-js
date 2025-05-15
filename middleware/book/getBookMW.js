/*
 * Egy könyv egyed lekérdezése
 */
module.exports = function(objectRepository) {
    const BookModel = objectRepository.BookModel;
    return (req, res, next) => {
        BookModel.findOne({
            _id: req.params.bookid
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
    }
};