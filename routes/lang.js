const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Admin = require('../models/admin');
const passport = require('passport');


router.get('/', function (req, res, next) {
    res.render('en/index', {title: 'Express', layout: 'layout/layouten'});
});

router.get('/about-us', function (req, res, next) {
    res.render('en/about', {title: 'About-Us', layout: 'layout/layouten'});
});

router.get('/feature', function (req, res, next) {
    res.render('en/feature', {title: 'Feature', layout: 'layout/layouten'});
});

/******Start services****/
router.get('/one', function (req, res, next) {
    res.render('en/services/one', {title: 'one', layout: 'layout/layouten'});
});
router.get('/two', function (req, res, next) {
    res.render('en/services/two', {title: 'two', layout: 'layout/layouten'});
});
router.get('/tree', function (req, res, next) {
    res.render('en/services/tree', {title: 'tree', layout: 'layout/layouten'});
});
router.get('/four', function (req, res, next) {
    res.render('en/services/four', {title: 'four', layout: 'layout/layouten'});
});
/******End services****/

router.get('/testmonials', function (req, res, next) {
    res.render('en/testmonials', {title: 'Testmonials', layout: 'layout/layouten'});
});

router.get('/request-job', function (req, res, next) {
    res.render('en/job', {title: 'Request-Job', layout: 'layout/layouten'});
});

router.get('/contact-us', function (req, res, next) {
    res.render('contact', {title: 'Contact-Us', layout: 'layout/layouten'});
});


module.exports = router;
