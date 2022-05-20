const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Countery = require('../models/countery');
const Order = require('../models/order');
const Fatora = require('../models/fatora');
const Admin = require('../models/admin');
const usercontrller = require('../controller/usercontroller');
const {isLoggedIn} = require("../helpers");

/* GET users listing. */
router.get('/:type', isLoggedIn, usercontrller.allusers);
router.get('/pending/all', isLoggedIn, usercontrller.allpending);


router.get('/active/:id', isLoggedIn, function (req, res, next) {
    const { id } = req.params;

    User.updateOne({_id: id}, {$set: {status: 1}}, (error, result) => {
        if (error) {
            console.error(error);
            res.redirect('/');
            return;
        }
        console.log(result);
        req.flash('success-active', "done");
        // res.redirect('/admin/pending');
        res.redirect('/admin/users/pending/all');
    });
});


router.get('/ban/:id', isLoggedIn, function (req, res, next) {
    const { id } = req.params;

    User.updateOne({_id: id}, {$set: {status: 2}}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/');
            return;
        }
        console.log(result);
        req.flash('success-user', "done");
        res.redirect('back');
    });
});

/*********start create user*** */
router.get('/create/:type', isLoggedIn, function (req, res, next) {
    const permission = req.user.permission;
    let type;
    let type2;
    if (req.params.type == 'client') {
        type2 = "user";
        type = 'العملاء';
    } else if (req.params.type == 'traders') {
        type2 = "vendor";
        type = 'التجار';
    } else if (req.params.type == 'deleveries') {
        type2 = "delevery";
        type = 'المندوبين';
    } else {
        res.redirect('/admin');
    }
    const errors = req.flash('registeruser');

    let cats;
    Countery.find({}, (err, catt) => {

        res.render('users/create', {
            title: 'Create-User',
            error: errors,
            cats: catt,
            type: type,
            type2: type2,
            permission: permission,
            layout: 'layout/admin'
        });
    });
});
router.post('/insert', isLoggedIn, usercontrller.Inseruser);
/*********end create user*** */
/*********start Edit user*** */
router.get('/edit/:type/:id', isLoggedIn, function (req, res, next) {
    const permission = req.user.permission;
    let type;
    let type2;
    User.findOne({_id: req.params.id}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/');
        }
        console.log(result);
        if (req.params.type == 'user') {
            type2 = "user";
            type = 'العملاء';
        } else if (req.params.type == 'vendor') {
            type2 = "vendor";
            type = 'التجار';
        } else if (req.params.type == 'delevery') {
            type2 = "delevery";
            type = 'المندوبين';
        } else {
            res.redirect('/admin');
        }

        let cats;
        Countery.find({}, (err, catt) => {
            res.render('users/edit', {
                title: 'Edit-User',
                cats: catt,
                type: type,
                type2: type2,
                user: result,
                permission: permission,
                layout: 'layout/admin'
            });
        });
    });
});


router.get('/payed/:id', isLoggedIn, function (req, res, next) {

    User.findOne({_id: req.params.id}, (err, result) => {
        if (err) {
            console.log(err);
            res.redirect('/');
        }
        console.log(result);
        if (result.wallet != 0) {

            Order.updateMany({delvery: req.params.id}, {$set: {fatora: true}}, (err, orders) => {
            });

            const fatora = new Fatora({
                user: req.params.id,
                price: result.wallet,
                whocreate: req.user._id,
                type: "single"
            });
            fatora.save();

            User.updateOne({_id: req.params.id}, {$set: {wallet: 0}}, (error, result) => {
            });
            req.flash('success-detail', "done");
        }

        res.redirect('back');
    });
});


router.post('/update', isLoggedIn, usercontrller.updateuser);
/*********end Edit user*** */
/*********start Delete user*** */
router.get('/delete/:id', isLoggedIn, usercontrller.deleteuser);
/*********end Delete user*** */
router.get('/detail/:id', isLoggedIn, function (req, res, next) {
    const permission = req.user.permission;
    let type;
    const success = req.flash('success-detail');
    User.findOne({_id: req.params.id}, (err, result) => {
        if (err) {
            console.log(err);
            res.redirect('/');
        }
        console.log(result);
        if (result.type == "user") {
            type = false;
            Order.find({user: req.params.id}, (err, orders) => {
                Fatora.find({user: req.params.id}, (err, fatores) => {
                    res.render('users/detail', {
                        title: 'Details-User',
                        success: success,
                        fatores: fatores,
                        orders: orders,
                        type: type,
                        user: result,
                        permission: permission,
                        layout: 'layout/admin'
                    });
                });
            });

        } else if (result.type == "vendor") {
            type = false;
            Order.find({trader: req.params.id}, (err, orders) => {
                Fatora.find({user: req.params.id}, (err, fatores) => {
                    res.render('users/detail', {
                        title: 'Details-User',
                        success: success,
                        fatores: fatores,
                        orders: orders,
                        type: type,
                        user: result,
                        permission: permission,
                        layout: 'layout/admin'
                    });
                });
            });
        } else if (result.type == "delevery") {
            type = true;
            Order.find({delvery: req.params.id}, (err, orders) => {
                //   Admin.findOne({email:'admin@gmail.com'},(err , admin)=>{
                res.render('users/detail', {
                    title: 'Details-User',
                    success: success,
                    orders: orders,
                    type: type,
                    user: result,
                    permission: permission,
                    layout: 'layout/admin'
                });
                //   });
            });
        }
    });
});


module.exports = router;
