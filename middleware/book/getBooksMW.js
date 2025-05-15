/*
 * Az összes könyv lekérdezése
 */
module.exports = function(objectRepository) {
    const BookModel = objectRepository.BookModel;

    return (req, res, next) => {
        const searchQuery = req.query.search || '';
        const genreFilter = req.query.filter || '';

        const query = {};

        if (searchQuery) {
            query.title = { $regex: searchQuery, $options: 'i' };
        }

        if (genreFilter) {
            query.genre = genreFilter;
        }

        BookModel.find(query)
            .then(books => {
                res.locals.books = books;
                return next();
            })
            .catch(err => {
                console.error(err);
                return next(err);
            });
    }
};