const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');
const couponController = require('../controller/couponcontroller');
const {isLoggedIn} = require("../helpers");

router.get('/', isLoggedIn, couponController.allcoupons);

router.get('/create', isLoggedIn, function (req, res, next) {
    const permission = req.user.permission;
    res.render('coupons/create', {title: 'Create-Coupons', permission: permission, layout: 'layout/admin'});
});
router.post('/store', couponController.Insercoupons);

router.get('/edit/:id', isLoggedIn, function (req, res, next) {
    const permission = req.user.permission;
    Coupon.findOne({_id: req.params.id}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/coupons');
        }
        console.log(result);
        res.render('coupons/edit', {
            title: 'Edit-Coupon',
            coupon: result,
            permission: permission,
            layout: 'layout/admin'
        });
    });
});
router.post('/update', isLoggedIn, couponController.updatecoupons);

router.get('/delete/:id', isLoggedIn, couponController.deletecoupons);


module.exports = router;