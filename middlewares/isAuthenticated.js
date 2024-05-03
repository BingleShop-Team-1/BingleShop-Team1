const passport = require('../libs/passport');

module.exports = passport.authenticate('jwt', { session: false });