module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next(); // Si el cliente se autentica de manera correcta continua.
    }
    return res.redirect('/login'); // No autenticado se le envia al login.
};
