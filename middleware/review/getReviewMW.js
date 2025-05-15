/*
 * Egy adott review lekérdezése
 */
module.exports = function(objectRepository) {
    const ReviewModel = objectRepository.ReviewModel;
    return (req, res, next) => {
        ReviewModel.findOne({
            _id: req.params.reviewid
        }).then(review => {
            if (!review) {
                return res.redirect('/book/' + req.params.bookid);
            }
            res.locals.review = review;
            return next();
        }).catch(err => {
            console.error(err);
            return next(err);
        });
    }
};