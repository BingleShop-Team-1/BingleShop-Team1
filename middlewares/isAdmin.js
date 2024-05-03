module.exports = (req, res, next) => {
    if (req.user.is_admin) {
        return next()
    }
    return res.sendStatus(403)
};