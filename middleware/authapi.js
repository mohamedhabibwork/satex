const {verify} = require("../helpers/jwt");

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        req.user = verify(token);
        next();
    } catch (error) {
        console.log({auth: error})
        res.json({
            message: "Authentication Faild!"
        })
    }
}

module.exports = auth;