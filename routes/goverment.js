var express = require('express');
const csrf = require('csurf');
var router = express.Router();
const {check, validationResult} = require('express-validator');
const Goverment = require('../models/goverment');
const Countery = require('../models/countery');
const govermentcontrller = require('../controller/govermentcontroller');
const {isLoggedIn} = require("../helpers");

router.get('/', isLoggedIn, govermentcontrller.allgoverments);

router.get('/create', function (req, res, next) {
    Countery.find({}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/goverments');
        }
        console.log(result);
        res.render('goverments/create', {title: 'Create-Goverments', cats: result, layout: 'layout/admin'});
    });
});
router.post('/store', isLoggedIn, govermentcontrller.Insergoverments);

router.get('/edit/:id', isLoggedIn, function (req, res, next) {
    var countries = '';
    Countery.find({}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/goverments');
        }
        countries = result;
    });
    Goverment.findOne({_id: req.params.id}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/goverments');
        }
        console.log(result);
        res.render('goverments/edit', {
            title: 'Edit-Goverment',
            goverment: result,
            countries: countries,
            layout: 'layout/admin'
        });
    });
});
router.post('/update', isLoggedIn, govermentcontrller.updategoverments);

router.get('/delete/:id', isLoggedIn, govermentcontrller.deletegoverments);

module.exports = router;