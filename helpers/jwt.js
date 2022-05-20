const jwt = require("jsonwebtoken");
module.exports.JWT_SECRET =  "sata express"
module.exports.sign = (payload) => {
    console.log({payload})
    return jwt.sign(payload,JWT_SECRET, {
        expiresIn: '1d',
        algorithm: "RS256"
    });
}

module.exports.verify = (payload) => {
    console.log({payload})
    return jwt.verify(payload,JWT_SECRET);
}