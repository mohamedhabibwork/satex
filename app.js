const {SESSION_SECRET, COOKIE_SECRET, SESSION_COOKIE_TIME, MONGO_URL} = require("./helpers");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
//const expressHbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const cors = require('cors');
const fileUpload = require('express-fileupload');

require("dotenv").config();

// const multer = require('multer');
// const upload = multer({dest: 'uploads/'});

//Start Define view Routes
const indexRouter = require('./routes/index');
const langRouter = require('./routes/lang');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const counteryRouter = require('./routes/countery');
const govermentsRouter = require('./routes/goverment');
const citiesRouter = require('./routes/city');
const catRouter = require('./routes/cat');
const subcatRouter = require('./routes/subcat');
const couponRouter = require('./routes/coupon');
const orderRouter = require('./routes/order');
//End Define view Routes
//Start Define Api Routes
const usersRouterapi = require('./routes/api/users');
const indexRouterapi = require('./routes/api/index');
//End Define Api Routes

const app = express();

app.use(fileUpload({useTempFiles: true}));
app.use(cors());
//Connect to database
mongoose.connect(
    MONGO_URL,{useNewUrlParser: true},
    (err) => { //
        if (err) {
            console.log("Error MongoDB : " + err);
        } else {
            console.log('MongoDB database connection successfully');
        }
    });
const expressSwagger = require('express-swagger-generator-fix')(app);


let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: `localhost:${3000}`,
        basePath: '/api',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./routes/api/**/*.js'] //Path to the API handle folder
};
expressSwagger(options);
const swaggerUi = require('express-swaggerize-ui');

app.use('/api-docs.json', function (req, res) {
    res.json(require('./path/to/swaggerize/docs.json'));
});
app.use('/api-docs', swaggerUi());
require('./config/passport');
const {sessionStore} = require("./helpers/mongoose");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser(COOKIE_SECRET, {
        maxAge: SESSION_COOKIE_TIME,
        httpOnly: true,
        sameSite: true,
    }
));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: SESSION_COOKIE_TIME},
    store: sessionStore,
}));
app.use(flash());
app.use(passport.initialize({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    cookie: {maxAge: SESSION_COOKIE_TIME},
}));

app.use(passport.session({
    cookie: {maxAge: SESSION_COOKIE_TIME},
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}));
app.use(express.static(path.join(__dirname, 'public')));


//Start Define Views File Route
app.use('/', indexRouter);
app.use('/en', langRouter);
app.use('/admin/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/admin/countries', counteryRouter);
app.use('/admin/goverments', govermentsRouter);
app.use('/admin/cities', citiesRouter);
app.use('/admin/cats', catRouter);
app.use('/admin/subcats', subcatRouter);
app.use('/admin/coupons', couponRouter);
app.use('/admin/orders', orderRouter);
//End Define Views File Route

//Start Define Apis File Route
app.use('/api', indexRouterapi);
app.use('/api/users', usersRouterapi);
//End Define Apis File Route

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;


/*
finish admin page
*/