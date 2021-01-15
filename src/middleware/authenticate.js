const User = require('../modules/user');

const authenticate = async (req, res, next) => {
    const token = req.header('x-auth');

    await User.findByToken(token)
        .then((user) => {
            if (!user) {
                return Promise.reject();
            }
            req.user = user;
            req.token = token;
            next();
        })
        .catch((err) => res.status(401).send())
}

module.exports = authenticate;