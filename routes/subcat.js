var express = require('express');
const csrf = require('csurf');
var router = express.Router();
const {check, validationResult} = require('express-validator');
const Subcat = require('../models/subcat');
const Cat = require('../models/cat');
const subcatcontroller = require('../controller/subcatcontroller');
const {isLoggedIn} = require("../helpers");

router.get('/', isLoggedIn, subcatcontroller.allsubcats);

router.get('/create', function (req, res, next) {
    Cat.find({}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/subcats');
        }
        console.log(result);
        res.render('subcats/create', {title: 'Create-Subcats', cats: result, layout: 'layout/admin'});
    });
});
router.post('/store', isLoggedIn, subcatcontroller.Insersubcats);

router.get('/edit/:id', isLoggedIn, function (req, res, next) {
    var cats = '';
    Cat.find({}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/subcats');
        }
        cats = result;
    });
    Subcat.findOne({_id: req.params.id}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/subcats');
        }
        console.log(result);
        res.render('subcats/edit', {title: 'Edit-Subcats', subcat: result, cats: cats, layout: 'layout/admin'});
    });
});
router.post('/update', isLoggedIn, subcatcontroller.updatesubcats);

router.get('/delete/:id', isLoggedIn, subcatcontroller.deletesubcats);


module.exports = router;