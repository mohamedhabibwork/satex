var express = require('express');
const csrf = require('csurf');
var router = express.Router();
const {check, validationResult} = require('express-validator');
const Countery = require('../models/countery');
const counterycontrller = require('../controller/counterycontroller');
const upload = require('../middleware/upload');
const {isLoggedIn} = require("../helpers");

router.get('/', isLoggedIn, counterycontrller.allcounteries);

router.get('/create', isLoggedIn, function (req, res, next) {
    var permission = req.user.permission;
    res.render('countries/create', {title: 'Create-Counteries', permission: permission, layout: 'layout/admin'});
});
router.post('/store', upload.single('photo'), isLoggedIn, counterycontrller.Insercountery);

router.get('/edit/:id', isLoggedIn, function (req, res, next) {
    var permission = req.user.permission;
    Countery.findOne({_id: req.params.id}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/countries');
        }
        console.log(result);
        res.render('countries/edit', {
            title: 'Edit-Countery',
            country: result,
            permission: permission,
            layout: 'layout/admin'
        });
    });
});
router.post('/update', isLoggedIn, counterycontrller.updatecountery);

router.get('/delete/:id', isLoggedIn, counterycontrller.deletecountery);

module.exports = router;