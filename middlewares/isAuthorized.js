module.exports = (allowedUserRole = []) => (req, res, next) => {
    const isAllowed = allowedUserRole.includes(req.user.role)
    if (!isAllowed) {
        return res.sendStatus(403)
    }
    next();
}

function isAuthorized(allowedUserRole) {
    return function(req, res, next) {
        
    }
}