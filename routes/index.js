var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');
const Admin = require('../models/admin');
const passport = require('passport');
var nodemailer = require('nodemailer');
const Order = require('../models/order');
const {notLoggedIn} = require("../helpers");

/* GET home page. */
router.get('/', function (req, res, next) {
    var success = req.flash('success-mail-contactus');
    res.render('index', {title: 'Express', layout: 'layout/layout', success: success, error: req.session.error});
});

router.get('/about-us', function (req, res, next) {
    res.render('about', {
        title: 'About-Us',
        layout: 'layout/layout',
        success: req.session.success,
        error: req.session.error
    });
});

router.get('/feature', function (req, res, next) {
    res.render('feature', {
        title: 'Feature',
        layout: 'layout/layout',
        success: req.session.success,
        error: req.session.error
    });
});

/******Start services****/
router.get('/one', function (req, res, next) {
    res.render('services/one', {title: 'one', layout: 'layout/layout'});
});
router.get('/two', function (req, res, next) {
    res.render('services/two', {title: 'two', layout: 'layout/layout'});
});
router.get('/tree', function (req, res, next) {
    res.render('services/tree', {title: 'tree', layout: 'layout/layout'});
});
router.get('/four', function (req, res, next) {
    res.render('services/four', {title: 'four', layout: 'layout/layout'});
});
/******End services****/

router.get('/testmonials', function (req, res, next) {
    res.render('testmonials', {
        title: 'Testmonials',
        layout: 'layout/layout',
        success: req.session.success,
        error: req.session.error
    });
});

router.get('/request-job', function (req, res, next) {
    var success = req.flash('success-mail-job');
    res.render('job', {title: 'Request-Job', layout: 'layout/layout', success: success});
});

router.get('/contact-us', function (req, res, next) {
    var success = req.flash('success-mail-contactus');
    res.render('contact', {title: 'Contact-Us', layout: 'layout/layout', success: success});
});

//start login route
router.get('/Login', notLoggedIn, function (req, res, next) {
    //   Admin.updateOne({_id:'61e5d4e1c6cb068585ada09b'}, {$set : {password : new Admin().encryptPassword('123456789')}},(error , result)=>{

    // });
    var errors = req.flash('login-error');
    var authuser = req.user;
    res.render('auth/login', {title: 'Login', layout: 'layout/login', authuser: authuser, error: errors});
});

router.post('/Login', [
    check('email').notEmpty().isEmail().withMessage('Email In valid'),
    check('password').notEmpty().withMessage('password In valid')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = [];
        for (let i = 0; i < errors.errors.length; i++) {
            messages.push(errors.errors[i].msg);
        }
        req.flash('login-error', messages)
        res.redirect('Login');
        return;
    }
    next();
}, passport.authenticate('local-signin', {
    successRedirect: '/admin',
    failureRedirect: '/Login',
    failureFlash: true
}));
//end login route


router.post('/Send-mail-contactus', function (req, res, next) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ahmedgamal012064@gmail.com',
            pass: '#Ahmed@123'
        }
    });
    var mailOptions = {
        from: req.body.email,
        to: 'ahmedgamal012064@gmail.com',
        subject: req.body.subject,
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            req.flash('success-mail-contactus', "done");
            return res.redirect('/');
        }
    });
});


router.post('/Send-mail-job', function (req, res, next) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ahmedgamal012064@gmail.com',
            pass: '#Ahmed@123'
        }
    });
    var mailOptions = {
        from: req.body.email,
        to: 'ahmedgamal012064@gmail.com',
        subject: "new job",
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            req.flash('success-mail-job', "done");
            return res.redirect('/request-job');
        }
    });
});


router.post('/Trace-Order', function (req, res, next) {
    Order.find({_id: req.body.id}, 'status', (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            return res.status(500).json({
                'data': err,
                'status': 'error',
                'msg': 'done',
            });
        }
        console.log(result);
        return res.status(200).json({
            'data': result,
            'status': 'success',
            'msg': 'done',
        });
    });
});

module.exports = router;
