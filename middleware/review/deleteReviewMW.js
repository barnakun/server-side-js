/*
 * Egy review törlése az adatbázisból
 */
module.exports = function(objectRepository) {
    return (req, res, next) => {
        return res.locals.review.deleteOne().then(() => {
            return res.redirect('/book/' + req.params.bookid);
        }).catch(err => {
            console.error(err);
            return next(err);
        });
    }
};