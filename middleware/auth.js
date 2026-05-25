module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next(); // Usuario autenticado, continúa
    }
    return res.redirect('/login'); // No autenticado, lo enviamos al login
};
