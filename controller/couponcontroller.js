const Coupon = require('../models/coupon');

allcoupons = function (req, res, next) {
    //get all coupons
    var permission = req.user.permission;
    Coupon.find({}, (err, result) => {
        if (err) {
            console.log(err);
            res.redirect('/admin/coupons');
        }
        console.log(result);
        var success = req.flash('success-coupon');
        res.render('coupons/index', {
            title: 'Coupons',
            coupons: result,
            permission: permission,
            layout: 'layout/admin',
            success: success
        });
    });
}; //all coupons  

Insercoupons = function (req, res, next) {
    const coupon = new Coupon({
        code: req.body.code,
        type: req.body.type,
        date: req.body.date,
        price: req.body.price,
    });
    coupon.save((error, result) => {
        if (error) {
            console.log("Error :" + error);
            res.redirect('/admin/coupons');
        }
        console.log(result);
        req.flash('success-coupon', "done");
        res.redirect('/admin/coupons');
    });
}; //Insert coupons

updatecoupons = function (req, res, next) {
    const id = req.body.id;
    const updatecoupon = {
        code: req.body.code,
        type: req.body.type,
        date: req.body.date,
        price: req.body.price,
    }
    Coupon.updateOne({_id: id}, {$set: updatecoupon}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/coupons');
            return;
        }
        console.log(result);
        req.flash('success-coupon', "done");
        res.redirect('/admin/coupons');
    });
}; //Updateuser

deletecoupons = function (req, res, next) {
    const id = req.params.id;
    Coupon.deleteOne({_id: id}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/coupons');
            return;
        }
        console.log(result);
        res.redirect('/admin/coupons');
    });
}; //Delete coupons


module.exports =
    {
        allcoupons: allcoupons,
        Insercoupons: Insercoupons,
        updatecoupons: updatecoupons,
        deletecoupons: deletecoupons
    }