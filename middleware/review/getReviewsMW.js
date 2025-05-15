/*
 * Visszaadja az adatbázisban található összes véleményt
 */
module.exports = function(objectRepository) {
    const ReviewModel = objectRepository.ReviewModel;
    return (req, res, next) => {
        ReviewModel.find({
            book: res.locals.book._id
        }).then(reviews => {
            res.locals.reviews = reviews;
            return next();
        }).catch(err => {
            console.error(err);
            return next(err);
        });
    }
};