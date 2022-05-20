const {MONGO_URL, SESSION_COOKIE_TIME} = require("./index");
const mongoose = require("mongoose");

const connection = mongoose.createConnection(MONGO_URL);
const MongoStore = require('connect-mongo');

// const MongoStore = require("connect-mongo").create({
//     mongoUrl:MONGO_URL,
//     connection
// });


const sessionStore = new MongoStore({
    mongoUrl:MONGO_URL,
    mongooseConnection: connection,
    collectionName: "sessions",
    ttl:SESSION_COOKIE_TIME,
});
// mongoose.Schema.plugin(mongoosePaginate);
module.exports = {
    connection,
    sessionStore,
    mongoose,
}