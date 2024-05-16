module.exports = (allowedUserRole = is_Admin) => (req, res, next) => { // closure
    const isAllowed = allowedUserRole.includes(req.user.is_Admin)

    if (!isAllowed) {
        return res.sendStatus(403)
    }

    next();
}
