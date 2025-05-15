/**
 * Middleware to render a view.
 *
 * @param objectRepository - The object repository containing dependencies.
 * @param view - The name of the view to render.
 * @returns {*}
 */
module.exports = function(objectRepository, view) {
    return function(req, res) {
        res.render(view);
    };
};