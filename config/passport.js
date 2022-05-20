const passport = require('passport');
const User = require('../models/user');
const Admin = require('../models/admin');
const {validPassword, encryptPassword} = require("../helpers");
const LocalStrategy = require('passport-local').Strategy;

const passportOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}

passport.serializeUser(function (user, done) {
    console.log({serializeUser:user?.id})
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Admin.findById(id, function (err, user) {
        console.log({deserializeUser:user?.id})
        done(err, user);
    });
});

passport.use('local-signin', new LocalStrategy(passportOptions, (req, email, password, done) => {
    Admin.findOne({'email': email}, function (err, user) {
        if (err) return done(null, false, err);
        if (!user || !validPassword(password,user.password)) return done(null, false, req.flash('login-error', 'Wrong email or password'));

        return done(null, user);
    })
}));


passport.use('local-signup', new LocalStrategy(passportOptions, (req, email, password, done) => {

    Admin.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, req.flash('signup-error', 'This Email already excit'));
        }
        const newUser = new User({
            email: email,
            password: encryptPassword(password),
        });
        newUser.save((err, user) => {
            if (err) {
                return done(err);
            }
            return done(null, user);
        });
    })
}));