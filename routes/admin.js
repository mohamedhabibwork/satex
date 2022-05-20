var express = require('express');
const csrf = require('csurf');
var router = express.Router();
const {check, validationResult} = require('express-validator');
const Admin = require('../models/admin');
const Cat = require('../models/cat');
const Subcat = require('../models/subcat');
const City = require('../models/city');
const Countery = require('../models/countery');
const Coupon = require('../models/coupon');
const Goverment = require('../models/goverment');
const Notification = require('../models/notification');
const Order = require('../models/order');
const User = require('../models/user');
const senmessge = require("../middleware/sendmessage");

const admincontroller = require('../controller/admincontroller');
const Fatora = require('../models/fatora');
const Banner = require('../models/banner');
const upload = require('../middleware/upload');

const fs = require('fs');
const mime = require('mime');

const {route} = require('.');
const {isLoggedIn} = require("../helpers");

router.get('/', isLoggedIn, function (req, res, next) {
    var admin = req.user.type == "admin" ? true : false;
    var permission = req.user.permission;
    res.render('home', {title: 'Admin Home', permission: permission, admin: admin, layout: 'layout/admin'});

});
/////////////Start Notifications*/////////////////
router.get('/notifications', isLoggedIn, function (req, res, next) {
    var permission = req.user.permission;
    Notification.find({type: {$exists: true, $ne: null}}, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        var success = req.flash('success-notify');
        res.render('notifications/index', {
            title: 'notifications',
            notifications: result,
            permission: permission,
            layout: 'layout/admin',
            success: success
        });
    }).populate('user');
});
router.post('/post-notifications', isLoggedIn, function (req, res, next) {
    User.find({type: req.body.type}, "token", (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            result.forEach(function (resu, index, arr) {
                senmessge(resu.token, req.body.title, req.body.body);
                var notification = new Notification({
                    title: req.body.title,
                    title_en: req.body.title,
                    body: req.body.body,
                    body_en: req.body.body,
                    user: resu._id,
                    type: 'admin'
                });
                notification.save();
            });
        }
    });
    req.flash('success-notify', "done");
    return res.redirect('/admin/notifications');
});
/////////////End Notifications*/////////////////
// router.get('/reports', isLoggedIn,function(req, res, next) {
//       var permission = req.user.permission;
//         Fatora.find({},(err , result)=>{
//           res.render('reports/index', { title: 'reports',fators:result,permission:permission, layout: 'layout/admin' });
//         }).populate('user');
// });


router.get('/reports', isLoggedIn, function (req, res, next) {
    var permission = req.user.permission;
    var type = req.query.type;
    var date_from = req.query.date_from ? new Date(req.query.date_from) : '';
    var date_to = req.query.date_to ? new Date(req.query.date_to) : '';
    var success = req.flash('success-report');

    var datefrom = req.query.date_from ? req.query.date_from : '';
    var dateto = req.query.date_to ? req.query.date_to : '';

    if (type == "renve") {

        Order.find({status: "finished", fatora: false, createdAt: {$gte: date_from, $lt: date_to}}, (err, orders) => {
            let price = 0;
            let count = 0;
            if (orders) {
                orders.forEach(function (item, index) {
                    price += item.price;
                    count += 1;
                });
            }
            var stats2 = count != 0 ? true : false;
            Fatora.find({}, (err, result) => {
                res.render('reports/index', {
                    title: 'reports',
                    success: success,
                    stats2: stats2,
                    fators: result,
                    date_from: datefrom,
                    date_to: dateto,
                    count: count,
                    price: price,
                    permission: permission,
                    layout: 'layout/admin'
                });
            }).populate('whocreate').populate('user');
        }).populate('delvery');

    } else {
        Order.find({status: "finished", fatora: false, createdAt: {$gte: date_from, $lt: date_to}}, (err, orders) => {
            let price = 0;
            let count = 0;
            if (orders) {
                orders.forEach(function (item, index) {
                    price += item.delvery.wallet;
                    count += 1;
                });
            }
            var stats = count != 0 ? true : false;
            Fatora.find({}, (err, result) => {
                res.render('reports/index', {
                    title: 'reports',
                    success: success,
                    stats: stats,
                    fators: result,
                    date_from: datefrom,
                    date_to: dateto,
                    count: count,
                    price: price,
                    permission: permission,
                    layout: 'layout/admin'
                });
            }).populate('whocreate').populate('user');
        }).populate('delvery');
    }
});


router.get('/print/:id', isLoggedIn, function (req, res, next) {
    Fatora.findOne({_id: req.params.id}, (err, result) => {
        res.render('reports/print', {title: 'print', pay: result, layout: 'layout/print'});
    }).populate('whocreate').populate('user');
});

router.get('/mswada/:date_from/:date_to', isLoggedIn, function (req, res, next) {
    var permission = req.user.permission;
    var date_from = req.params.date_from ? new Date(req.params.date_from) : '';
    var date_to = req.params.date_to ? new Date(req.params.date_to) : '';

    Order.find({status: "finished", createdAt: {$gte: date_from, $lt: date_to}}, (err, orders) => {
        res.render('reports/details', {
            title: 'mswada',
            orders: orders,
            permission: permission,
            layout: 'layout/admin'
        });
    }).populate('delvery');
});


router.get('/create-mswada/:date_from/:date_to', isLoggedIn, function (req, res, next) {
    var date_from = req.params.date_from ? new Date(req.params.date_from) : '';
    var date_to = req.params.date_to ? new Date(req.params.date_to) : '';

    Order.find({status: "finished", fatora: false, createdAt: {$gte: date_from, $lt: date_to}}, (err, orders) => {
        if (orders) {
            orders.forEach(function (item, index) {
                const fatora = new Fatora({
                    user: item.delvery.id,
                    price: item.delvery.wallet,
                    datefrom: date_from,
                    dateto: date_to,
                    whocreate: req.user._id,
                    type: "collect"
                });
                fatora.save();

                User.updateOne({_id: item.delvery.id}, {$set: {wallet: 0}}, (error, result) => {
                });
            });
        }
    }).populate('delvery');

    Order.updateMany({
        status: "finished",
        fatora: false,
        createdAt: {$gte: date_from, $lt: date_to}
    }, {$set: {fatora: true}}, (err, orders) => {
    });
    req.flash('success-report', "done");

    res.redirect('/admin/reports');
});


/*

 Order.find({},(err , orders)=>{ // find({where(name : 'ahmed')},select('name email'),callback)
        if(err){
            console.log(err);
            res.redirect('/admin/orders');
        }
         console.log(result);
*/


router.get('/Profile', isLoggedIn, function (req, res, next) {
    var permission = req.user.permission;
    var user = req.user;

    Banner.find({}, (err, banners) => {
        if (err) {
            console.log(err);
            res.redirect('/admin/Profile');
        }
        console.log(banners);
        var successbanner = req.flash('success-banner');
        var success = req.flash('success-profile');
        res.render('auth/profile', {
            title: 'Admin Profile',
            permission: permission,
            layout: 'layout/admin',
            user: user,
            banners: banners,
            successbanner: successbanner
        });
    });
});

router.post('/Update-Profile', isLoggedIn, function (req, res, next) {
    var profile = {
        sitepercent: req.body.sitepercent,
        deleverypercent: req.body.deleverypercent,
        vendorpercent: req.body.vendorpercent,
        currency: req.body.currency,
        waypay: req.body.waypay,
        phone: req.body.phone,
        whatsapp: req.body.whatsapp,
        email: req.body.email,
        facebook: req.body.facebook,
    };
    Admin.updateOne({_id: req.body.id}, {$set: profile}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/Profile');
            return;
        }
        console.log(result);
        req.flash('success-profile', "done");
        res.redirect('/admin/Profile');
    });
});

router.get('/permission', isLoggedIn, admincontroller.alladmins);


router.get('/permission/edit/:id', isLoggedIn, function (req, res, next) {
    var permission = req.user.permission;
    Admin.findOne({_id: req.params.id}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/permission');
        }
        console.log(result);
        res.render('admins/edit', {title: 'Edit-Admin', admin: result, permission: permission, layout: 'layout/admin'});
    });
});
router.post('/permission/update', isLoggedIn, admincontroller.updateadmins);


router.get('/permission/create', isLoggedIn, function (req, res, next) {
    var permission = req.user.permission;
    res.render('admins/create', {title: 'Create-Admins', permission: permission, layout: 'layout/admin'});
});
router.post('/permission/store', isLoggedIn, admincontroller.Inseradmins);

router.get('/delete/:id', isLoggedIn, admincontroller.deleteadmins);

router.get('/logout', isLoggedIn, function (req, res, next) {  //router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logOut();
    res.redirect('/Login');
});

/////////////////////Start Count//////////////////////////
router.get('/orders-count', function (req, res, next) {
    Order.find().count(function (err, count) {
        return res.status(200).json({
            'status': true,
            'data': count,
            'meg': 'done'
        });
    });
});
router.get('/accept-orders-count', function (req, res, next) {
    Order.find({status: "finished"}).count(function (err, count) {
        return res.status(200).json({
            'status': true,
            'data': count,
            'meg': 'done'
        });
    });
});
router.get('/pending-orders-count', function (req, res, next) {
    Order.find({status: "pendingdelevery"}).count(function (err, count) {
        return res.status(200).json({
            'status': true,
            'data': count,
            'meg': 'done'
        });
    });
});
router.get('/cancel-orders-count', function (req, res, next) {
    Order.find({status: "cancel"}).count(function (err, count) {
        return res.status(200).json({
            'status': true,
            'data': count,
            'meg': 'done'
        });
    });
});
router.get('/users-count', function (req, res, next) {
    User.find({type: "user"}).count(function (err, count) {
        return res.status(200).json({
            'status': true,
            'data': count,
            'meg': 'done'
        });
    });
});
router.get('/vendors-count', function (req, res, next) {
    User.find({type: "vendor"}).count(function (err, count) {
        return res.status(200).json({
            'status': true,
            'data': count,
            'meg': 'done'
        });
    });
});
router.get('/deleveries-count', function (req, res, next) {
    User.find({type: "delevery"}).count(function (err, count) {
        return res.status(200).json({
            'status': true,
            'data': count,
            'meg': 'done'
        });
    });
});

router.get('/Wallet-count', function (req, res, next) {
    User.find({type: "delevery"}, 'wallet', (err, count) => {
        var walet = 0;
        count.forEach(element => element.wallet ? walet = parseInt(walet + element.wallet) : walet = parseInt(walet + 0));
        return res.status(200).json({
            'status': true,
            'data': parseInt(walet),
            'meg': 'done'
        });
    });
});

router.get('/earns-count', function (req, res, next) {
    Fatora.find({}, 'price', (err, count) => {
        var walet = 0;
        count.forEach(element => element.price ? walet = parseInt(walet + element.price) : walet = parseInt(walet + 0));
        return res.status(200).json({
            'status': true,
            'data': parseInt(walet),
            'meg': 'done'
        });
    });
});


///////////////////Banner
router.get('/banners', isLoggedIn, function (req, res, next) {
    //get all banners
    var permission = req.user.permission;
    Banner.find({}, (err, result) => {
        if (err) {
            console.log(err);
            res.redirect('/admin/banners');
        }
        console.log(result);
        var success = req.flash('success-banner');
        res.render('admins/banners', {
            title: 'Banners',
            banners: result,
            permission: permission,
            layout: 'layout/admin',
            success: success
        });
    });
});

router.get('/create-banners', isLoggedIn, function (req, res, next) {
    var permission = req.user.permission;
    res.render('admins/createbanners', {title: 'Create-Banners', permission: permission, layout: 'layout/admin'});
});


router.post('/post-Banner', isLoggedIn, function (req, res, next) {  //, upload.single('avatar')

    if (!req.files) {
        return res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let avatar = req.files.avatar;

        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        avatar.mv('./uploads/' + avatar.name);

        //     //send response
        //   return res.send({
        //         status: true,
        //         message: 'File is uploaded',
        //         data: {
        //             name: avatar.name,
        //             mimetype: avatar.mimetype,
        //             size: avatar.size
        //         }
        //     });

        const banner = new Banner({
            photo: 'uploads/' + avatar.name
        });

        banner.save((error, result) => {
            if (error) {
                console.log("Error :" + error);
                res.redirect('/admin/Profile');
            }
            console.log(result);
            req.flash('success-banner', "done");
            return res.redirect('/admin/Profile');
        });
    }
});


/////////////////////End   Count//////////////////////////
// Countery.find().count(function(err, count){
//     obj['counteries'] = count;
// });
// Coupon.find().count(function(err, count){
//     obj['coupons'] = count;
// });
// Goverment.find().count(function(err, count){
//     obj['goverments'] = count;
// });
// City.find().count(function(err, count){
//     obj['cities'] = count;
// });
// Subcat.find().count(function(err, count){
//     obj['subcat'] = count;
// });
// Cat.find().count(function(err, count){
//     obj['cat'] = count;
// });
module.exports = router;