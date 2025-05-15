/*
 * Egy vélemény mentése
 */
module.exports = function(objectRepository) {
    const ReviewModel = objectRepository.ReviewModel;
    return (req, res, next) => {
        if (!req.body.text || !req.body.rating) {
            return next();
        }

        let r = new ReviewModel();

        if (typeof res.locals.review !== 'undefined') {
            r = res.locals.review;
        }

        r.rating = parseInt(req.body.rating);
        r.text = req.body.text;
        r.book = res.locals.book._id;

        return r.save().then(() => {
            return res.redirect('/book/' + req.params.bookid);
        }).catch(err => {
            console.error(err);
            return next(err);
        });
    }
};