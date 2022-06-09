const {compareSync, genSaltSync, hashSync} = require("bcrypt");
module.exports.isLoggedIn = async (req, res, next) => {
    const isUnAuthenticated = await req.isUnauthenticated();
    if (isUnAuthenticated) {
        const {cookies, sessions} = req
        console.log({
            method: 'isLoggedIn',
            isUnAuthenticated,
            cookies,
            sessions
        });
        res.redirect('/Login');
        return;
    }
    return next();
}

module.exports.notLoggedIn = async (req, res, next) => {
    const isAuthenticated = await req.isAuthenticated();
    if (isAuthenticated) {
        const {cookies, sessions} = req
        console.log({
            method: 'notLoggedIn',
            isAuthenticated,
            cookies,
            sessions
        });
        res.redirect('/admin');
        return;
    }
    return next();
}

module.exports.SESSION_SECRET = "token";
module.exports.COOKIE_SECRET = "token";

module.exports.encryptPassword = (password) => hashSync(password, genSaltSync(31), null);

module.exports.validPassword = (password, hashedValue) => compareSync(password, hashedValue);

module.exports.SESSION_COOKIE_TIME = 60 * 60 * 24 * 30 * 10000;
module.exports.MONGO_URL = process.env.MONGO_URL || "mongodb+srv://habib:habib@cluster0.s88gm.mongodb.net/?retryWrites=true&w=majority";
